import { BottomTabBarProps, BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import type { ParamListBase, RouteProp } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FALLBACK_ACTIVE_COLOR = "#0B5FFF";
const FALLBACK_INACTIVE_COLOR = "#64748B";

type TabRoute = RouteProp<ParamListBase, string>;

type TabBarItemProps = {
  route: TabRoute;
  options: BottomTabNavigationOptions;
  isFocused: boolean;
  activeTintColor: string;
  inactiveTintColor: string;
  onPress: () => void;
  onLongPress: () => void;
};

function getRouteLabel(options: BottomTabNavigationOptions, routeName: string) {
  if (typeof options.tabBarLabel === "string") {
    return options.tabBarLabel;
  }

  if (typeof options.title === "string") {
    return options.title;
  }

  return routeName;
}

function TabBarItem({
  route,
  options,
  isFocused,
  activeTintColor,
  inactiveTintColor,
  onPress,
  onLongPress,
}: TabBarItemProps) {
  const iconStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: withTiming(isFocused ? 0 : -2, { duration: 220 }) },
        {
          scale: withSpring(isFocused ? 1.14 : 1, {
            damping: 15,
            stiffness: 250,
            mass: 0.7,
          }),
        },
      ],
    }),
    [isFocused]
  );

  const labelContainerStyle = useAnimatedStyle(
    () => ({
      marginTop: withTiming(isFocused ? 0 : 2, { duration: 180 }),
      maxHeight: withTiming(isFocused ? 0 : 20, { duration: 220 }),
      opacity: withTiming(isFocused ? 0 : 1, { duration: 180 }),
    }),
    [isFocused]
  );

  const labelStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: withTiming(isFocused ? 8 : 0, { duration: 220 }) }],
    }),
    [isFocused]
  );

  const icon = options.tabBarIcon?.({
    focused: isFocused,
    color: isFocused ? activeTintColor : inactiveTintColor,
    size: 22,
  });

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      activeOpacity={0.9}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
    >
      <Animated.View style={[styles.iconContainer, iconStyle]}>{icon}</Animated.View>
      <Animated.View style={[styles.labelWrap, labelContainerStyle]}>
        <Animated.Text
          numberOfLines={1}
          style={[styles.label, { color: isFocused ? activeTintColor : inactiveTintColor }, labelStyle]}
        >
          {getRouteLabel(options, route.name)}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function TabNavigatorLayout({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);
  const indicatorX = useSharedValue(0);

  const tabCount = state.routes.length;
  const tabWidth = containerWidth > 0 ? containerWidth / tabCount : 0;
  const indicatorWidth = Math.max(tabWidth - 12, 0);

  const activeTintColor = useMemo(() => {
    const focusedRoute = state.routes[state.index];
    const focusedOptions = descriptors[focusedRoute.key]?.options;
    return focusedOptions?.tabBarActiveTintColor ?? FALLBACK_ACTIVE_COLOR;
  }, [descriptors, state.index, state.routes]);

  const inactiveTintColor = useMemo(() => {
    const focusedRoute = state.routes[state.index];
    const focusedOptions = descriptors[focusedRoute.key]?.options;
    return focusedOptions?.tabBarInactiveTintColor ?? FALLBACK_INACTIVE_COLOR;
  }, [descriptors, state.index, state.routes]);

  useEffect(() => {
    if (!tabWidth) {
      return;
    }

    indicatorX.value = withSpring(state.index * tabWidth, {
      damping: 18,
      stiffness: 190,
      mass: 0.8,
    });
  }, [indicatorX, state.index, tabWidth]);

  const activePillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View
        onLayout={(event) => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}
        style={styles.tabBar}
      >
        {indicatorWidth > 0 && (
          <Animated.View style={[styles.activePill, { width: indicatorWidth }, activePillStyle]} />
        )}

        {state.routes.map((route, index) => {
          const options = descriptors[route.key]?.options ?? {};
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if (Platform.OS !== "web") {
                Haptics.selectionAsync().catch(() => undefined);
              }

              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarItem
              key={route.key}
              activeTintColor={activeTintColor}
              inactiveTintColor={inactiveTintColor}
              isFocused={isFocused}
              onLongPress={onLongPress}
              onPress={onPress}
              options={options}
              route={route as TabRoute}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    position: "absolute",
    right: 0,
  },
  tabBar: {
    backgroundColor: "rgba(248, 250, 252, 0.92)",
    borderColor: "#E2E8F0",
    borderRadius: 28,
    borderWidth: 1,
    elevation: 14,
    flexDirection: "row",
    overflow: "hidden",
    paddingHorizontal: 6,
    paddingVertical: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  activePill: {
    backgroundColor: "#DCE8FF",
    borderRadius: 22,
    bottom: 8,
    left: 6,
    position: "absolute",
    top: 8,
  },
  item: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 62,
    zIndex: 2,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 24,
    minWidth: 32,
  },
  labelWrap: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    // letterSpacing: 0.2,
  },
});

export function SafeAreaContent() {
  // Get the height of the tab bar to add padding at the bottom of the screen, ensuring content is not hidden behind the tab bar
  const tabBarHeight = 80; // This should match the minHeight of the tab bar items

  return <View style={{ paddingBottom: tabBarHeight + 24 }}></View>;
}
