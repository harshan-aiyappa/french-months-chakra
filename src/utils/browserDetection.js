// Browser detection utility
export const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = '';

    // Detect browser
    if (userAgent.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
        browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
    } else if (userAgent.indexOf('Edg') > -1) {
        browserName = 'Edge';
        browserVersion = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
    } else if (userAgent.indexOf('Chrome') > -1) {
        browserName = 'Chrome';
        browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
    } else if (userAgent.indexOf('Safari') > -1) {
        browserName = 'Safari';
        browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || '';
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
        browserName = 'Opera';
        browserVersion = userAgent.match(/(?:Opera|OPR)\/(\d+\.\d+)/)?.[1] || '';
    }

    // Detect OS
    let os = 'Unknown';
    if (userAgent.indexOf('Win') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) os = 'iOS';

    return {
        browser: browserName,
        version: browserVersion,
        os,
        fullName: `${browserName} ${browserVersion}`,
        isSupported: browserName === 'Chrome' || browserName === 'Edge' || browserName === 'Safari',
    };
};

// Feature compatibility checks
export const checkFeatureSupport = () => {
    const features = {
        asr: {
            name: 'Speech Recognition (ASR)',
            supported: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
            status: 'success',
        },
        audioContext: {
            name: 'Audio Calibration (VAD)',
            supported: !!(window.AudioContext || window.webkitAudioContext),
            status: 'success',
        },
        mediaDevices: {
            name: 'Microphone Access',
            supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
            status: 'success',
        },
    };

    // Update status based on support
    Object.keys(features).forEach(key => {
        if (!features[key].supported) {
            features[key].status = 'error';
        }
    });

    return features;
};
