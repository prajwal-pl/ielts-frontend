import { useState, useEffect, useCallback } from "react"

export function useSpeechSynthesis() {
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (speechSynthesis && !isSpeaking) {
        setIsSpeaking(true)
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.onend = () => setIsSpeaking(false)
        speechSynthesis.speak(utterance)
      }
    },
    [speechSynthesis, isSpeaking],
  )

  const cancel = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [speechSynthesis])

  return { speak, cancel, isSpeaking }
}

