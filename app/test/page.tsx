// pages/index.js or any other Next.js page
"use client";
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const MyApp = () => {
  const [abortController, setAbortController] = useState(new AbortController());
  const [test, setTest] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // const controller = new AbortController();
      const signal = abortController.signal;

      try {
        const response = await fetch('/api/chat/localhost/ollama', {
          method: 'POST',
          body: JSON.stringify("hello"),
          signal: signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reader = response.body!.getReader();
        console.log(response);

        signal.addEventListener("abort", () => {
          reader.cancel();
          console.log('Fetch aborted...');
        });

        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            if (value) {
              console.log(decoder.decode(value));
              // Update your state with the received data if needed
            }
          }
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('Error during stream reading:', error);
          }
        } finally {
          reader.releaseLock();
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      }
    };

    // Invoke fetchData
    fetchData();

  }, [test]);

  return (
    <div>
      {/* Render the received stream data in the component */}
      <Button
        onClick={() => {
          abortController.abort();
        }}
      >
        hello
      </Button>
      <Button
        onClick={() => {
          setAbortController(new AbortController());
          // Toggle 'test' to trigger the useEffect and invoke fetchData
          setTest((prevTest) => !prevTest);
        }}
      >
        hello2
      </Button>
    </div>
  );
};

export default MyApp;
