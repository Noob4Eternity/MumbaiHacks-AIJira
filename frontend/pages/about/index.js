import Scheduler from '@/components/Scheduler'
import React from 'react'

function index() {

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: 'AIzaSyApdgzxy9sXJMr46mZcr-WmRaoTwdcDiCs', // Replace with your API Key
        clientId: '357754461396-b7kucbj3ouu137edvbka3iak072m1jeg.apps.googleusercontent.com', // Replace with your Client ID
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar',
      });
    };

    gapi.load('client:auth2', initClient);
  }, []);

  return (
    <Scheduler/>
  )
}

export default index
