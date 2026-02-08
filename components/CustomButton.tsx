import { TouchableOpacity, Text} from "react-native";

interface CustomButtonProps{
    title: string,      // the text in the button
    handlePress: () => void,    // the function that will be executed when the button is pressed
    containerStyles?: string,   // the style of the button
    textStyle?: string,         // the style of the text in the button
    isLoading?: boolean,        // the information if the button is loading
}

const CustomButton = ({
    title, 
    handlePress, 
    containerStyles, 
    textStyle, 
    isLoading}:
    CustomButtonProps) =>{
    

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7} // this is the opacity of the button when it is pressed
            className={`bg-secondary-100 rounded-xl justify-center items-center min-h-[60px] ${containerStyles} ${isLoading ? 'opacity-50' : ''} `}

            // if it's in loading disable the press
            disabled={isLoading}
            >
                {/* the button text */}
                <Text className={`text-primary font-psemibold ${textStyle}`}>
                    {title}
                </Text>

        </TouchableOpacity>    
    )
}

export default CustomButton
