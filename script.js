document.addEventListener('DOMContentLoaded', function() {
    // Initialize the site with config values
    initializeSite();
    
    // Set up version and download information
    loadVersionData();

    // Set up event listeners for download options
    setupEventListeners();
});

// Initialize site with config values
function initializeSite() {
    // Set document title
    document.title = `${config.projectName} - ${config.projectTagline}`;
    
    // Update all instances of project name
    document.getElementById('project-name').textContent = config.projectName;
    document.getElementById('hero-title').textContent = config.projectName;
    document.getElementById('hero-tagline').textContent = config.projectTagline;
    
    // Set URLs
    const githubLinks = [
        document.getElementById('github-link'),
        document.getElementById('github-footer-link'),
        document.getElementById('github-social-link'),
        document.getElementById('github-star-link')
    ];
    
    githubLinks.forEach(link => {
        if (link) link.href = config.repoUrl;
    });
    
    const docsLinks = [
        document.getElementById('docs-link'),
        document.getElementById('docs-footer-link'),
        document.getElementById('docs-btn')
    ];
    
    docsLinks.forEach(link => {
        if (link) link.href = config.docsUrl;
    });
    
    // Set license link
    const licenseLink = document.getElementById('license-link');
    if (licenseLink) licenseLink.href = 'https://www.gnu.org/licenses/gpl-3.0.txt';
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Set all-releases link
    const allReleasesLink = document.getElementById('all-releases-link');
    if (allReleasesLink) allReleasesLink.href = `${config.repoUrl}/releases`;
}

// Load version data from JSON file
async function loadVersionData() {
    try {
        const response = await fetch(config.versionsJsonUrl);
        if (!response.ok) {
            throw new Error(`Failed to load version data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Store the version data globally
        window.versionData = data;
        
        // Detect user's platform and set initial values
        detectPlatform();
        
        // Update the UI with version information
        updateVersionInfo();
        
    } catch (error) {
        console.error('Error loading version data:', error);
        document.getElementById('download-button').disabled = true;
        document.getElementById('download-title').textContent = 'Download unavailable';
        document.getElementById('download-details').textContent = 'Please check back soon for updates.';
    }
}

// Detect user's operating system and architecture
function detectPlatform() {
    const platform = document.getElementById('platform-select');
    const architecture = document.getElementById('architecture-select');
    
    // Detect OS
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.indexOf('win') !== -1) {
        platform.value = 'windows';
    } else if (userAgent.indexOf('mac') !== -1) {
        platform.value = 'macos';
    } else if (userAgent.indexOf('linux') !== -1) {
        platform.value = 'linux';
    }
    
    // Detect architecture (improved detection)
    // Note: Browser API limitations mean this is still basic detection
    if (userAgent.indexOf('arm') !== -1 || 
        userAgent.indexOf('aarch64') !== -1 || 
        (userAgent.indexOf('mac') !== -1 && /iPhone|iPad|iPod/.test(navigator.platform))) {
        architecture.value = 'arm';
    } else {
        architecture.value = 'intel'; // Default to intel for most devices
    }
    
    // Log for debugging
    console.log(`Detected platform: ${platform.value}, architecture: ${architecture.value}`);
}

// Set up event listeners
function setupEventListeners() {
    const releaseChannel = document.getElementById('release-channel');
    const platformSelect = document.getElementById('platform-select');
    const architectureSelect = document.getElementById('architecture-select');
    
    // Update version info when options change
    releaseChannel.addEventListener('change', updateVersionInfo);
    platformSelect.addEventListener('change', updateVersionInfo);
    architectureSelect.addEventListener('change', updateVersionInfo);
    
    // Download button click
    const downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', function(event) {
        const downloadUrl = getCurrentDownloadUrl();
        
        if (!downloadUrl) {
            event.preventDefault();
            alert('Download is not available for the selected platform and architecture.');
            return;
        }
        
        // If download URL is empty, disable button (should already be handled)
        if (downloadUrl.trim() === '') {
            event.preventDefault();
            alert('Download is not yet available for this version.');
            return;
        }
        
        // Otherwise, set the href attribute
        downloadButton.href = downloadUrl;
    });
}

// Update version information based on selected options
function updateVersionInfo() {
    if (!window.versionData) {
        console.error('Version data not loaded');
        return;
    }
    
    const channel = document.getElementById('release-channel').value;
    const platform = document.getElementById('platform-select').value;
    const architecture = document.getElementById('architecture-select').value;
    
    // Get channel data
    const channelData = window.versionData.channels[channel];
    if (!channelData) {
        console.error(`Channel data not found for: ${channel}`);
        return;
    }
    
    // Update version badge
    const versionBadge = document.getElementById('version-badge');
    versionBadge.textContent = `v${channelData.latest_version}`;
    
    // Update release date with better formatting
    const releaseDate = document.getElementById('release-date');
    if (window.versionData.timestamp) {
        const date = new Date(window.versionData.timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        releaseDate.textContent = `Release Date: ${date.toLocaleDateString('en-US', options)}`;
    } else {
        releaseDate.textContent = '';
    }

    // Update download title and details
    const downloadTitle = document.getElementById('download-title');
    downloadTitle.textContent = `Modsee for ${capitalize(platform)} (${architecture === 'intel' ? 'Intel/AMD' : 'ARM'})`;
    
    const downloadDetails = document.getElementById('download-details');
    downloadDetails.textContent = `${capitalize(channel)} Channel • v${channelData.latest_version}`;
    
    // Update download button state
    const downloadButton = document.getElementById('download-button');
    const downloadUrl = getCurrentDownloadUrl();
    
    // Check if URL is empty, null, or undefined
    if (!downloadUrl || downloadUrl.trim() === '') {
        downloadButton.disabled = true;
        downloadButton.classList.add('btn-secondary');
        downloadButton.classList.remove('btn-primary');
        downloadDetails.textContent = 'Download not available for this selection';
    } else {
        downloadButton.disabled = false;
        downloadButton.classList.add('btn-primary');
        downloadButton.classList.remove('btn-secondary');
        downloadDetails.textContent = `${capitalize(channel)} Channel • v${channelData.latest_version}`;
    }
    
    // Update checksum
    updateChecksum(channelData, platform, architecture);
    
    // Update release notes
    updateReleaseNotes(channelData);
    
    // Show critical update alert if applicable
    const isCritical = channelData.critical_update || false;
    
    if (isCritical) {
        document.getElementById('download-box').classList.add('border-danger');
    } else {
        document.getElementById('download-box').classList.remove('border-danger');
    }
}

// Get current download URL based on selected options
function getCurrentDownloadUrl() {
    if (!window.versionData) return null;
    
    const channel = document.getElementById('release-channel').value;
    const platform = document.getElementById('platform-select').value;
    const architecture = document.getElementById('architecture-select').value;
    
    try {
        const url = window.versionData.channels[channel].platforms[platform][architecture].download_url;
        // Return null for empty strings to simplify handling in updateVersionInfo
        return url && url.trim() !== '' ? url : null;
    } catch (error) {
        console.error('Error getting download URL:', error);
        return null;
    }
}

// Update checksum information
function updateChecksum(channelData, platform, architecture) {
    const checksumValue = document.getElementById('checksum-value');
    
    try {
        const checksum = channelData.platforms[platform][architecture].checksum;
        checksumValue.textContent = checksum || 'Not available';
    } catch (error) {
        checksumValue.textContent = 'Not available';
    }
}

// Update release notes
function updateReleaseNotes(channelData) {
    const releaseNotesList = document.getElementById('release-notes-list');
    releaseNotesList.innerHTML = '';
    
    if (channelData.release_notes && channelData.release_notes.length > 0) {
        channelData.release_notes.forEach(note => {
            const li = document.createElement('li');
            li.className = 'list-group-item bg-transparent border-0 ps-0';
            li.innerHTML = `<span class="text-muted me-2">-</span> ${note}`;
            releaseNotesList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-transparent border-0 ps-0';
        li.innerHTML = 'No release notes available';
        releaseNotesList.appendChild(li);
    }
}

// Helper: Capitalize first letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
} 