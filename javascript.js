        const audioPlayer = document.getElementById('audioPlayer');
        const playlist = document.getElementById('playlist');
        const songs = Array.from(playlist.getElementsByTagName('li'));
        const skipButton = document.getElementById('skipButton');
        const prevButton = document.getElementById('prevButton');
        const shuffleButton = document.getElementById('shuffleButton');
        const loopButton = document.getElementById('loopButton');
        const playPauseButton = document.getElementById('play-pause');
        const progressBar = document.getElementById('progress-bar');
        const progressContainer = document.getElementById('progress-container');
        const currentTimeDisplay = document.getElementById('current-time');
        const totalTimeDisplay = document.getElementById('total-time');
        const volumeControl = document.getElementById('volume-control');
        const lyricsButton = document.getElementById('lyricsButton');
        const lyricsSidebar = document.getElementById('lyricsSidebar');
        const closeLyrics = document.getElementById('closeLyrics');
        let currentSongIndex = 0;
        let isLooping = false;

        function playSong() {
            const currentSong = songs[currentSongIndex];
            const audioSource = currentSong.getAttribute('data-src');
            audioPlayer.src = audioSource;
            audioPlayer.play();
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            updateLyricsWithAnimation();
        }

        function updateLyricsWithAnimation() {
            if (lyricsSidebar.classList.contains('open')) {
                lyricsSidebar.classList.remove('open');
                setTimeout(() => {
                    updateLyrics();
                    lyricsSidebar.classList.add('open');
                }, 150);
            } else {
                updateLyrics();
            }
        }

        function updateLyrics() {
            const currentSong = songs[currentSongIndex];
            const lyricsId = currentSong.getAttribute('data-lyrics');
            const lyricsElement = document.getElementById(lyricsId);
            const lyricsTitle = document.getElementById('lyricsTitle');
            const lyricsContent = document.getElementById('lyricsContent');

            if (lyricsElement) {
                lyricsTitle.textContent = currentSong.textContent;
                lyricsContent.innerHTML = lyricsElement.innerHTML;
            } else {
                lyricsTitle.textContent = "Not Available";
                lyricsContent.textContent = "Lyrics for this song are not available.";
            }
        }

        function playPauseSong() {
            if (audioPlayer.paused) {
                if (!audioPlayer.src) {
                    currentSongIndex = 0;
                    playSong();
                } else {
                    audioPlayer.play();
                }
                playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audioPlayer.pause();
                playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        }

        function shufflePlaylist() {
            for (let i = songs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [songs[i], songs[j]] = [songs[j], songs[i]];
            }
            playlist.innerHTML = '';
            songs.forEach(song => playlist.appendChild(song));
            currentSongIndex = 0;
            playSong();
        }

        function toggleLyrics() {
            lyricsSidebar.classList.toggle('open');
            updateLyrics();
        }

        audioPlayer.addEventListener('ended', function () {
            if (isLooping) {
                audioPlayer.play();
            } else {
                currentSongIndex = (currentSongIndex + 1) % songs.length;
                playSong();
            }
        });

        playlist.addEventListener('click', function (event) {
            if (event.target.tagName === 'LI') {
                currentSongIndex = songs.indexOf(event.target);
                playSong();
            }
        });

        skipButton.addEventListener('click', function () {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            playSong();
        });

        prevButton.addEventListener('click', function () {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            playSong();
        });

        shuffleButton.addEventListener('click', shufflePlaylist);

        loopButton.addEventListener('click', function () {
            isLooping = !isLooping;
            loopButton.classList.toggle('active', isLooping);
        });

        playPauseButton.addEventListener('click', playPauseSong);

        progressContainer.addEventListener('click', function(e) {
            const clickPosition = e.clientX - progressContainer.getBoundingClientRect().left;
            const clickPercentage = clickPosition / progressContainer.offsetWidth;
            audioPlayer.currentTime = clickPercentage * audioPlayer.duration;
        });

        audioPlayer.addEventListener('timeupdate', function() {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = `${progress}%`;
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        });

        audioPlayer.addEventListener('loadedmetadata', function() {
            totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
        });

    function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}   
     
lyricsButton.addEventListener('click', toggleLyrics);

closeLyrics.addEventListener('click', toggleLyrics);
