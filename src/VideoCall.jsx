import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

const VideoCall = () => {
  const [localStream, setLocalStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [otherStreams, setOtherStreams] = useState([]);
  const [connectedPeers, setConnectedPeers] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef([]);

  useEffect(() => {
    // Inicializar PeerJS
    const peer = new Peer();
    setPeer(peer);

    // Obtener acceso a la cámara y al micrófono
    console.log('Requesting media devices...');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        console.log('Got local stream:', stream);
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        // Escuchar eventos de conexión entrante
        peer.on('call', call => {
          console.log('Incoming call:', call);
          // Contestar la llamada y enviar nuestro stream local
          call.answer(stream);

          // Manejar el stream remoto
          call.on('stream', remoteStream => {
            console.log('Received remote stream:', remoteStream);
            setOtherStreams(prevStreams => [...prevStreams, remoteStream]);
          });
        });

        // Escuchar eventos de conexión a otros peers
        peer.on('open', () => {
          console.log('Connected to PeerJS server');
          peer.on('connection', connection => {
            console.log('Connected to peer:', connection.peer);
            setConnectedPeers(prevPeers => [...prevPeers, connection.peer]);
          });
        });
      })
      .catch(error => console.error('Error accessing media devices:', error));

    return () => {
      // Cerrar la conexión PeerJS cuando el componente se desmonte
      peer.disconnect();
    };
  }, []);

  // Llamar a un nuevo usuario
  const callUser = (userId) => {
    console.log('Calling user:', userId);
    const call = peer.call(userId, localStream);
    call.on('stream', remoteStream => {
      console.log('Received remote stream:', remoteStream);
      setOtherStreams(prevStreams => [...prevStreams, remoteStream]);
    });
  };

  return (
    <div>
      <div>
        <h1>Videoconferencia</h1>
        <video ref={localVideoRef} autoPlay muted></video>
      </div>
      <div>
        {otherStreams.map((stream, index) => (
          <video key={index} ref={el => remoteVideosRef.current[index] = el} autoPlay></video>
        ))}
      </div>
      <div>
        <h2>Participantes conectados:</h2>
        <ul>
          {connectedPeers.map(peerId => (
            <li key={peerId}>{peerId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoCall;



// import React, { useEffect, useRef, useState } from 'react';
// import Peer from 'peerjs';

// const VideoCall = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [peer, setPeer] = useState(null);
//   const [otherStreams, setOtherStreams] = useState([]);

//   const localVideoRef = useRef(null);
//   const remoteVideosRef = useRef([]);

//   useEffect(() => {
//     // Inicializar PeerJS
//     const peer = new Peer();
//     setPeer(peer);

//     // Obtener acceso a la cámara y al micrófono
//     console.log('Requesting media devices...');
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         console.log('Got local stream:', stream);
//         setLocalStream(stream);
//         localVideoRef.current.srcObject = stream;

//         // Escuchar eventos de conexión entrante
//         peer.on('call', call => {
//           console.log('Incoming call:', call);
//           // Contestar la llamada y enviar nuestro stream local
//           call.answer(localStream);

//           // Manejar el stream remoto
//           call.on('stream', remoteStream => {
//             console.log('Received remote stream:', remoteStream);
//             setOtherStreams(prevStreams => [...prevStreams, remoteStream]);
//           });
//         });
//       })
//       .catch(error => console.error('Error accessing media devices:', error));

//     return () => {
//       // Cerrar la conexión PeerJS cuando el componente se desmonte
//       peer.disconnect();
//     };
//   }, []);

//   // Llamar a un nuevo usuario
//   const callUser = (userId) => {
//     console.log('Calling user:', userId);
//     const call = peer.call(userId, localStream);
//     call.on('stream', remoteStream => {
//       console.log('Received remote stream:', remoteStream);
//       setOtherStreams(prevStreams => [...prevStreams, remoteStream]);
//     });
//   };

//   return (
//     <div>
//       <div>
//         <h1>Videoconferencia</h1>
//         <video ref={localVideoRef} autoPlay muted></video>
//       </div>
//       <div>
//         {otherStreams.map((stream, index) => (
//           <video key={index} ref={el => remoteVideosRef.current[index] = el} autoPlay></video>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VideoCall;

