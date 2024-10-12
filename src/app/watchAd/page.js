'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { usePaymentAmount } from '../../../store'
export default function Component() {
  const router = useRouter()
  const [originalPrice] = useState(80)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef(null)

  const videoIds = [
    'jrd-acToTsE',
    'ZvzKuqSDyG8',
    'K87aFjB7Ff0'
  ]

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = initializeYouTubePlayer
  }, [])

  const initializeYouTubePlayer = () => {
    const randomVideoId = videoIds[Math.floor(Math.random() * videoIds.length)]

    playerRef.current = new window.YT.Player('youtube-player', {
      height: '360',
      width: '640',
      videoId: randomVideoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      }
    })
  }

  const onPlayerReady = (event) => {
    setVideoLoaded(true)
    event.target.playVideo()
  }

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true)
      setTimeout(() => {
        event.target.stopVideo()
        setIsPlaying(false)
        
        router.push(`/verification`)
      }, 12000)
    } else {
      setIsPlaying(false)
    }
  }
  const { paymentAmount, setPaymentAmount } = usePaymentAmount();
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <Script src="https://www.youtube.com/iframe_api" />
      
      <motion.h2 
        className="text-3xl font-bold text-green-400 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ORIGINAL PRICE: ${paymentAmount}
      </motion.h2>
      
      <motion.div 
        className="w-full max-w-xl aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div id="youtube-player" />
        {!videoLoaded && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-xl">Loading video...</div>
          </div>
        )}
      </motion.div>

      {isPlaying && (
        <motion.div
          className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl font-bold text-green-400">
            Watch the video to unlock your special discount!
          </p>
        </motion.div>
      )}
    </div>
  )
}