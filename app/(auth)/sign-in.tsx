import { ScrollView, Image, View, Text } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import { SafeAreaView } from "react-native-safe-area-context";


const SignIn = () => {
  return (
        // it's a articular space that avoid to show the content in the notch of the phone
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                {/* min-h-[85vh] means that the content will take 85% of the screen height */}
                <View className="w-full justify-center min-h-[85vh] px-4 my-6">
                    <Image
                        source={icons.logo}
                        resizeMode ="contain"
                        className="w-[115px] h-[35px]"
                    />

                    <Text className="text-2xl text-white font-psemibold mt-10">
                        Log in to Aora
                    </Text>
                  
                </View>
            </ScrollView>
        </SafeAreaView>
  )
}

export default SignIn

