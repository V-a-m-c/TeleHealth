import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams } from 'react-router-dom';

const VideoPage = () => {
  const { id } = useParams();
  const meetingRef = useRef(null);
  const [meetingDetails, setMeetingDetails] = useState(null);

  useEffect(() => {
    const storedMeetingDetails = JSON.parse(localStorage.getItem('meetings'));
    const meetingDetail = storedMeetingDetails.find(meeting => meeting.roomId === id);
    setMeetingDetails(meetingDetail);
  }, [id]);

  useEffect(() => {
    const initializeMeeting = async () => {
      const appID = 512980577;
      const serverSecret = "4e0a775404eaf278cfe44763882e974f";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, id, Date.now().toString(), "vamsi");

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      if (zp && zp.joinRoom) {
        zp.joinRoom({
          container: meetingRef.current,
          sharedLinks: [
            {
              name: 'Copy link',
              url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomId=${id}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
        });
      } else {
        console.error('Failed to create ZegoUIKitPrebuilt instance or joinRoom method is missing.');
      }
    };

    if (meetingDetails) {
      const checkMeetingTime = () => {
        const now = new Date().getTime();
        if (meetingDetails.scheduledTime <= now) {
          initializeMeeting();
        } else {
          const timeUntilMeeting = meetingDetails.scheduledTime - now;
          setTimeout(initializeMeeting, timeUntilMeeting);
        }
      };
      checkMeetingTime();
    }
  }, [meetingDetails, id]);

  return (
    <div style={{ width: '100vw', height: '100vh', maxWidth: '100%', maxHeight: '100%', paddingTop:'80px' }}>
      <div className="info-bar" style={{ padding: '10px', backgroundColor: '#f1f1f1', borderBottom: '1px solid #ddd' }}>
        <h4>Doctor: {meetingDetails?.doctorName}</h4>
        <h4>Patient: {meetingDetails?.patientName}</h4>
        <h5>Scheduled Time: {meetingDetails ? new Date(meetingDetails.scheduledTime).toLocaleString() : ''}</h5>
      </div>
      <div ref={meetingRef} style={{ width: '100%', height: 'calc(100vh - 60px)' }}></div>
    </div>
  );
};

export default VideoPage;
