// Modsee Website Configuration
const config = {
    // Project Information
    projectName: "Modsee",
    projectTagline: "Open-source graphical modeling platform for OpenSees",
    
    // URLs
    repoUrl: "https://github.com/ModseeDev/Modsee",
    docsUrl: "https://docs.modsee.net/",
    websiteUrl: "https://modsee.net",
    
    // Versions and Release Info
    versionsJsonUrl: "versions.json",
    
    // UI Customization
    primaryColor: "#2563eb", // Blue color
    accentColor: "#4ade80", // Green accent
    
    // Social Links
    socialLinks: {
        github: "https://github.com/ModseeDev/Modsee",
        twitter: "", // Add if available
        discord: ""  // Add if available
    }
};

if (typeof module !== 'undefined') {
    module.exports = config;
} 