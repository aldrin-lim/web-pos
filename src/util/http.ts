import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

export const attachToken = async (getTokenSilently: () => Promise<string>) => {
  try {
    const token = await getTokenSilently()
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } catch (e) {
    console.error('Failed to retrieve token', e)
  }
}

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized responses, maybe initiate a user sign-out or redirect to a login page.
    }
    // Optionally handle other error statuses or log errors.

    return Promise.reject(error)
  },
)

export const httpClient = axiosInstance
