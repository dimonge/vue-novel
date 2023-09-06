import axios from 'axios'

async function fetchCompletion(prompt: string) {
  try {
    const response = await axios.post('/api/completion', {
      messages: prompt
    })
    return response.data
  } catch (error) {
    console.error('Error fetching completion:', error)
    return ''
  }
}
export { fetchCompletion }
