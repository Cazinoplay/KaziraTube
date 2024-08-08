const API_KEY = 'AIzaSyDKjxUD9wYeOzm0_qn5-jetdXdEln9iAlI';
const CHANNEL_IDS = [
    'UCACMj8dGJg2V1puXYghluZw',
    'UCjZjkiP_XC1VMPqvH_6nhhQ',
    'UCV0F0HbqpN4fXlCCZdrMPqg', // Пример дополнительного канала
    'UCD8wjuKKEzVsn5ZCR-fg9Rw', // Пример дополнительного канала
    'UCqnFkmSDQPY_JmRGKXo0vMA'  // Пример дополнительного канала
];
let nextPageTokens = {};
let isFetching = false;

document.addEventListener('DOMContentLoaded', () => {
    fetchVideos();
    window.addEventListener('scroll', handleScroll);
});

function fetchVideos() {
    if (isFetching) return;
    isFetching = true;

    const channelPromises = CHANNEL_IDS.map(channelId => {
        const pageToken = nextPageTokens[channelId] || '';
        const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6&pageToken=${pageToken}`;
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                nextPageTokens[channelId] = data.nextPageToken;
                return data.items;
            });
    });

    Promise.all(channelPromises)
        .then(results => {
            const videoGallery = document.getElementById('video-gallery');
            results.flat().forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const videoItem = document.createElement('div');
                videoItem.classList.add('video-item');
                videoItem.innerHTML = `
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                    <p>${title}</p>
                `;
                videoGallery.appendChild(videoItem);
            });
            isFetching = false;
        })
        .catch(error => {
            console.error('Ошибка при загрузке видео:', error);
            isFetching = false;
        });
}

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchVideos();
    }
}
