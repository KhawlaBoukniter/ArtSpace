module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            console.log("[CRACO] Configuring webpack...");

            // Use Webpack 5 ignoreWarnings to silence the specific source map warning
            if (!webpackConfig.ignoreWarnings) {
                webpackConfig.ignoreWarnings = [];
            }

            webpackConfig.ignoreWarnings.push(
                function (warning) {
                    if (warning.module && warning.module.resource.includes("@mediapipe") && warning.module.resource.includes("tasks-vision")) {
                        return true;
                    }
                    if (warning.message && warning.message.includes("Failed to parse source map") && warning.message.includes("@mediapipe")) {
                        return true;
                    }
                    return false;
                }
            );

            // Also try regex format which is standard in Webpack 5
            webpackConfig.ignoreWarnings.push({
                module: /@mediapipe[\\/]tasks-vision/,
                message: /Failed to parse source map/,
            });

            console.log("[CRACO] Added ignoreWarnings for @mediapipe/tasks-vision");

            return webpackConfig;
        },
    },
};
