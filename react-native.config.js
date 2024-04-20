module.exports = {
    project: {
        ios: {
            automaticPodsInstallation: true
        }
    },
    dependencies: {
        'react-native-flipper': {
            platforms: {
                ios: null, // Exclude from iOS build
            },
        },
        'redux-flipper': {
            platforms: {
                ios: null, // Exclude from iOS build
            },
        },
        'react-native-vector-icons': {
            platforms: {
                ios: null,
            },
        },
    }
}