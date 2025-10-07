"use client"

import { useRef, useEffect, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Button } from "@/components/ui"

interface VideoPlayerProps {
    src: string
    poster?: string
    className?: string
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
    controls?: boolean
}

export default function VideoPlayer({
    src,
    poster,
    className = "",
    autoplay = true,
    muted = true,
    loop = true,
    controls = true
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(muted)
    const [showControls, setShowControls] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleCanPlay = () => {
            setIsLoading(false)
        }

        const handleCanPlayThrough = () => {
            setIsLoading(false)
            if (autoplay) {
                video.play().catch(console.error)
            }
        }

        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)
        const handleLoadStart = () => setIsLoading(true)
        const handleLoadedData = () => setIsLoading(false)

        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('canplaythrough', handleCanPlayThrough)
        video.addEventListener('play', handlePlay)
        video.addEventListener('pause', handlePause)
        video.addEventListener('loadstart', handleLoadStart)
        video.addEventListener('loadeddata', handleLoadedData)

        return () => {
            video.removeEventListener('canplay', handleCanPlay)
            video.removeEventListener('canplaythrough', handleCanPlayThrough)
            video.removeEventListener('play', handlePlay)
            video.removeEventListener('pause', handlePause)
            video.removeEventListener('loadstart', handleLoadStart)
            video.removeEventListener('loadeddata', handleLoadedData)
        }
    }, [autoplay])

    // Force autoplay on mount
    useEffect(() => {
        const video = videoRef.current
        if (!video || !autoplay) return

        const tryAutoplay = async () => {
            try {
                await video.play()
                setIsPlaying(true)
            } catch (error) {
                console.log('Autoplay failed:', error)
                // L'autoplay peut échouer sur certains navigateurs, c'est normal
            }
        }

        // Essayer l'autoplay après un court délai
        const timer = setTimeout(tryAutoplay, 100)
        return () => clearTimeout(timer)
    }, [autoplay])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
        } else {
            video.play().catch(console.error)
        }
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !video.muted
        setIsMuted(video.muted)
    }

    const toggleFullscreen = () => {
        const video = videoRef.current
        if (!video) return

        if (video.requestFullscreen) {
            video.requestFullscreen()
        }
    }

    return (
        <div
            className={`relative group ${className}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted={muted}
                loop={loop}
                playsInline
                autoPlay={autoplay}
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                onError={(e) => {
                    console.error('Erreur de lecture vidéo:', e)
                    setIsLoading(false)
                }}
            />

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            )}

            {/* Custom controls overlay */}
            {controls && (
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={togglePlay}
                                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                            </Button>

                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={toggleMute}
                                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                            >
                                {isMuted ? (
                                    <VolumeX className="w-4 h-4" />
                                ) : (
                                    <Volume2 className="w-4 h-4" />
                                )}
                            </Button>
                        </div>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={toggleFullscreen}
                            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                        >
                            <Maximize className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

        </div>
    )
}
