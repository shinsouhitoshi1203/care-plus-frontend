import padding from "@/utils/padding";
import { Button } from "@rneui/themed";

// cssInterop(Button, {
//   className: "titleStyle", // Standard classes map to the button's body
//   //   titleClasses: "titleStyle", // 'titleClasses' will map to the button's text
// });
const styles = {
  button: {
    ...padding(16, 32),
  },
  title: {
    color: "#FFFFFF", // White text
    fontSize: 36, // Larger font size
  },
};
function BigHelpButton() {
  return (
    <Button
      color="error"
      containerStyle={styles.button}
      //   className="absolute bottom-0 w-screen h-200 "
      radius={24}
      titleStyle={styles.title}
      onPress={() => alert("Fuck you")}
    >
      HELP
    </Button>
  );
}

export default BigHelpButton;
