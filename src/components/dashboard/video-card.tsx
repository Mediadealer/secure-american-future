'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { config } from '@/lib/config';

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  destroy: () => void;
}

export interface VideoCardRef {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  getCurrentTime: () => number;
}

interface VideoCardProps {
  isLoaded: boolean;
}

export const VideoCard = forwardRef<VideoCardRef, VideoCardProps>(
  function VideoCard({ isLoaded }, ref) {
    const playerRef = useRef<YTPlayer | null>(null);
    const [apiReady, setApiReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Expose play/pause functions to parent
    useImperativeHandle(ref, () => ({
      play: () => {
        playerRef.current?.playVideo();
      },
      pause: () => {
        playerRef.current?.pauseVideo();
      },
      toggle: () => {
        if (!playerRef.current) return;
        const state = playerRef.current.getPlayerState();
        if (state === window.YT?.PlayerState?.PLAYING) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
      },
      getCurrentTime: () => {
        return playerRef.current?.getCurrentTime() ?? 0;
      },
    }));

    // Load YouTube IFrame API
    useEffect(() => {
      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        setApiReady(true);
        return;
      }

      // Load the API script
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Set up callback
      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };

      return () => {
        window.onYouTubeIframeAPIReady = undefined;
      };
    }, []);

    // Initialize player when API is ready
    useEffect(() => {
      if (!apiReady) return;

      playerRef.current = new window.YT.Player('yt-player', {
        videoId: config.videoId,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          enablejsapi: 1,
          loop: 1,
          playlist: config.videoId,
          playsinline: 1,
        },
        events: {
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT?.PlayerState?.PLAYING);
          },
        },
      });

      return () => {
        playerRef.current?.destroy();
      };
    }, [apiReady]);

    // Handle tap to toggle play/pause
    const handleOverlayClick = () => {
      if (!playerRef.current) return;
      const state = playerRef.current.getPlayerState();
      if (state === window.YT?.PlayerState?.PLAYING) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    };

    return (
      <Card
        className={`col-span-full overflow-hidden rounded-sm py-0 border-2 border-border transition-all duration-500 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="relative w-full pb-[56.25%] bg-black">
          <div id="yt-player" className="absolute inset-0 w-full h-full" />
          {/* Transparent overlay for tap to pause/play */}
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={handleOverlayClick}
          />
        </div>
      </Card>
    );
  }
);
