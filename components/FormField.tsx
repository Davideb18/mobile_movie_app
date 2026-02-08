import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardTypeOptions } from "react-native";

// define the rule: what data this component expects to receive
// he need to receive this data to work
interface FormFieldProps {
    title: string, //it's obbligate to have this on
    value: string,

    // if you put? it's optional
    placeHolder?: string, // it's a string that the text put before typing
    handleChangeText: (e: string) => void, // it's a function that return void and take the string that we write and keep it in memory
    otherStyles?: string,// it's a string that contain the style of the component
    keyboardType?: KeyboardTypeOptions  // it's a string that contain the keyboard type of the component for example the @ for the email that show a keyboard with the @
}

// 3. Il Componente vero e proprio
const FormField = ({
    title,
    value,
    placeHolder,
    handleChangeText,
    otherStyles,
    ...props    // it keep all the other properties that are not define in the interface
}: FormFieldProps) => {
    // the data have to respect the rule define in FormFieldProps

    // stato to organize the eyes for the password
    // at the start it is false (hidden)
    const [showPassword, setShowPassword] = useState(false);
    return (
        // external container
        <View className={`space-y-2 ${otherStyles}`}>

            {/* etichetta label */}
            {/* 'email' written in a ligth gray 
            text-base é la grandezza standard del testo e font-pmedium it's a font
            he take the title that we pass to the component (es. email)*/}
            <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

            {/* now we create the input field so the place where the user type */}
            <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
                {/* now we crete the textInput*/}
                <TextInput
                    className="flex-1 text-white"
                    value={value}   // what we see is what there is in the value variable
                    placeholder={placeHolder}   // it's the text that are show in the input field before typing
                    onChangeText={handleChangeText} // when we change the text he call the function handleChangeText to update the value
                    secureTextEntry={title === 'Password' && !showPassword} // hide the password if we are in the password field and the passowrd button is not pressed
                    {...props} // the keyboard type


                />

                {/* now we create the eye button to show or hide the password
             every things that we put inside the {} it's code and it's not show in the app it's javascript, an if*/}
                {title === 'Password' && (<TouchableOpacity onPress={() =>
                    setShowPassword(!showPassword)}>
                    <Ionicons
                        name={!showPassword ? "eye" : "eye-off"}
                        size={24}
                        color="#CDCDE0"
                    />
                </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default FormField;