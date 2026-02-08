import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect } from "expo-router";
import { View, Text, ScrollView, Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
    // use the global context to check if the user is logged in
    // - loading: boolean -> if the app is loading
    // - isLogged: boolean -> if the user is logged in
    const { loading, isLogged } = useGlobalContext();
    
    // if the app is loading or the user is logged in, redirect to the home page
    if(!loading && isLogged){
        return <Redirect href="/home" />
    }

    return(
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>


                <View className="h-full justify-center items-center px-4">
                    <Image
                        source={icons.logo}
                        className="w-[130px] h-[84px]"
                        resizeMode="contain"
                    />

                <View className="relative mt-5">
                    <Text className="text-3xl text-white font-bold text-center">
                        Discover Endless Possibilities 
                    </Text>
                    <Text className="text-secondary">
                        Aora
                    </Text>
                   
                   <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
                        Where creativity meets innovation: embark on a journey of limitless exploration with Aora
                    </Text>
                    
                </View>


                </View>
            </ScrollView>

        </SafeAreaView>
    )
}