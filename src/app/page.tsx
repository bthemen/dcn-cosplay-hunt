'use client';
import React, { useState } from 'react';

/**
 * Main Game Component
 * Provides a mobile-first interface for the target hunting game.
 * * Logic Flow:
 * 1. Capture user input (code).
 * 2. Validate input and send POST request to the server API.
 * 3. Handle success and failure states, providing clear user feedback.
 */
export default function GamePage() {
  
  // --- Fields (State) ---

  /** @state {string} inputCode - Stores the target code currently typed by the user. */
  const [inputCode, setInputCode] = useState('');

  /** @state {string} status - Stores the feedback message displayed to the user (e.g., success/error). */
  const [status, setStatus] = useState('');

  /** @state {boolean} isLoading - Prevents duplicate submissions while the API request is pending. */
  const [isLoading, setIsLoading] = useState(false);

  // --- Methods (Handlers) ---

  /**
   * handleAction
   * Executes the API call to update the game state.
   * * @async
   * @throws Will throw an error if the network request fails or the server returns an error.
   */
  const handleAction = async () => {
    // Reset status before attempting action
    setStatus('Processing...');
    setIsLoading(true);

    try {
      // Example: Using Player ID 1 for this session
      const res = await fetch('/api/players/1/updateTargets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ code: parseInt(inputCode) }),
      });

      // Parse the JSON response body
      const data = await res.json();

      // Check if request was successful based on status code
      if (res.ok) {
        setStatus('Target Eliminated! New target assigned.');
        setInputCode(''); // Clear input on success
      } else {
        // Explicitly handle API-returned errors without fallbacks
        const errorMessage = data.message || data.error || 'An unknown error occurred.';
        setStatus(`Error: ${errorMessage}`);
      }

    } catch (err) {
      // Handle network failures or critical fetch exceptions
      console.error("Critical Failure in handleAction:", err);
      setStatus('Connection error. Please check your internet and try again.');
    } finally {
      // Always stop loading, regardless of outcome
      setIsLoading(false);
    }
  };

  // --- Render (JSX) ---

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <header>
        <h1>Target Hunter</h1>
        <p>Enter the code of your target to progress.</p>
      </header>

      {/* Mobile-friendly input area */}
      <section style={{ marginTop: '40px' }}>
        <input
          type="number"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Enter Target Code"
          disabled={isLoading}
          style={{
            padding: '15px',
            width: '100%',
            maxWidth: '300px',
            fontSize: '18px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
        
        <button
          onClick={handleAction}
          disabled={isLoading || !inputCode}
          style={{
            display: 'block',
            margin: '20px auto',
            padding: '15px 40px',
            backgroundColor: isLoading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Sending...' : 'Confirm Elimination'}
        </button>

        {/* Status display section */}
        {status && (
          <p style={{ 
            fontWeight: 'bold', 
            color: status.startsWith('Error') ? 'red' : 'green',
            marginTop: '10px' 
          }}>
            {status}
          </p>
        )}
      </section>
    </main>
  );
}