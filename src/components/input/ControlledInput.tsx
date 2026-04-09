import { Input } from "@rneui/themed";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface ControlledInputProps {
  name: string;

  // React hook form
  control: any;
  leftIcon?: any;
  rightIcon?: any;
  toggleDataVisible?: boolean;

  // allow passing any other props to Input component
  [key: string]: any;
}

/**
 * Renders a React Hook Form-controlled input field using `@rneui/themed`'s `Input` component.
 *
 * This component binds form state via `Controller`, applies shared styling, and optionally
 * renders left and right icon components. Any additional props are forwarded to the underlying
 * `Input` instance.
 *
 * @param props - Component props.
 * @param props.control - React Hook Form `control` object used by `Controller` to manage field state.
 * @param props.name - Unique field name registered in the form schema.
 * @param props.leftIcon - Optional icon component rendered on the left side of the input.
 * @param props.rightIcon - Optional icon component rendered on the right side of the input.
 * @param props.toggleDataVisible - Optional flag related to data visibility behavior (currently not used internally).
 * @param props.[key: string] - Any additional `Input` props to be passed through.
 *
 * @returns A controlled `Input` element connected to React Hook Form.
 */
function ControlledInput({
  control,
  type = "default",
  name,
  leftIcon,
  rightIcon,
  toggleDataVisible,
  ...props
}: ControlledInputProps) {
  const [dataVisible, setDataVisible] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const { value, onChange } = field;
        const LeftIconComponent = leftIcon ?? null;
        const RightIconComponent = rightIcon ?? null;
        return (
          <View>
            <Input
              secureTextEntry={toggleDataVisible ? !dataVisible : false}
              numberOfLines={1}
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={type}
              // Dynamically render left and right icons if provided
              {...(LeftIconComponent
                ? { leftIcon: <LeftIconComponent size={20} color="#98A6BA" strokeWidth={2.2} /> }
                : {})}
              {...(RightIconComponent
                ? { rightIcon: <RightIconComponent size={20} color="#98A6BA" strokeWidth={2.2} /> }
                : {})}
              {...(toggleDataVisible
                ? {
                    // secureTextEntry: true,
                    rightIcon: (
                      <Pressable onPress={() => setDataVisible((x) => !x)} hitSlop={8}>
                        {dataVisible ? (
                          <EyeOff size={20} color="#98A6BA" strokeWidth={2.2} />
                        ) : (
                          <Eye size={20} color="#98A6BA" strokeWidth={2.2} />
                        )}
                      </Pressable>
                    ),
                  }
                : {})}
              // Styles
              labelStyle={styles.label}
              containerStyle={styles.inputWrapper}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              leftIconContainerStyle={styles.leftIconContainer}
              rightIconContainerStyle={styles.rightIconContainer}
              placeholderTextColor="#98A6BA"
              renderErrorMessage={false}
              // other props passed from parent component
              {...props}
            />
            <View>{error && <Text style={{ color: "red" }}>{error.message}</Text>}</View>
          </View>
        );
      }}
    />
  );
}
export default ControlledInput;
