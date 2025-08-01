#### [Setup Environement](https://reactnative.dev/docs/set-up-your-environment)

1. Install [VS code](https://code.visualstudio.com/)
2. Install [Chocolety](https://chocolatey.org/install) in Powershell 
3. Install Node.js using Chocolaty `choco install nodejs.install` and check `node -v1`
4. Install JDK using Chocolaty `choco install -y microsoft-openjdk17` and add the JDK to the path variable and check with `java -version`
5. Install [Android Studio](https://developer.android.com/studio/index.html) and set it up based on the document linked in the title.


### 2. Project setup

1. [Create project files using expo](https://reactnative.dev/docs/environment-setup#start-a-new-react-native-project-with-expo)
	* `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
 	* `npx create-expo-app@latest todo_app`
2. Run the project
	* `npx expo start` or `npx expo start --tunnel`
3. Delete the template
   	* `npm run reset-project`
