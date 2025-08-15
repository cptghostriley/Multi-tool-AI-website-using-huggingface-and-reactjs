// AI Service functions for integrating with external APIs
const { spawn } = require('child_process');
const path = require('path');

const generateText = async (prompt, model = 'gpt-3.5-turbo', maxTokens = 500) => {
  try {
    return new Promise((resolve, reject) => {
      // Path to the Python script
      const pythonScript = path.join(__dirname, '../Engine/text.py');
      const engineDir = path.join(__dirname, '../Engine');
      
      // Check if we're on Windows and use the virtual environment
      const pythonCommand = process.platform === 'win32' 
        ? path.join(engineDir, 'venv', 'Scripts', 'python.exe')
        : 'python3';

      // Spawn Python process with the prompt as argument
      const pythonProcess = spawn(pythonCommand, [pythonScript, prompt], {
        cwd: engineDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            // Parse the JSON response from Python
            const result = JSON.parse(output.trim());
            if (result.success) {
              resolve(result.content);
            } else {
              reject(new Error(result.error || 'Python script failed'));
            }
          } catch (parseError) {
            // If JSON parsing fails, return the raw output
            resolve(output.trim());
          }
        } else {
          reject(new Error(`Python script failed with code ${code}: ${error}`));
        }
      });

      pythonProcess.on('error', (err) => {
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });
    });
  } catch (error) {
    console.error('Text generation error:', error);
    throw new Error(`Text generation failed: ${error.message}`);
  }
};

const generateImage = async (prompt, size = '512x512', style = 'realistic') => {
  try {
    return new Promise((resolve, reject) => {
      // Path to the Python script
      const pythonScript = path.join(__dirname, '../Engine/image.py');
      const engineDir = path.join(__dirname, '../Engine');
      
      // Check if we're on Windows and use the virtual environment
      const pythonCommand = process.platform === 'win32' 
        ? path.join(engineDir, 'venv', 'Scripts', 'python.exe')
        : 'python3';

      // Spawn Python process with the prompt as argument
      const pythonProcess = spawn(pythonCommand, [pythonScript, prompt], {
        cwd: engineDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            // Parse the JSON response from Python
            const result = JSON.parse(output.trim());
            if (result.success) {
              // Return the base64 image data URL for frontend
              resolve(result.image_data);
            } else {
              reject(new Error(result.error || 'Python script failed'));
            }
          } catch (parseError) {
            // If JSON parsing fails, assume it's an error message
            reject(new Error(`Failed to parse response: ${output.trim()}`));
          }
        } else {
          reject(new Error(`Python script failed with code ${code}: ${error}`));
        }
      });

      pythonProcess.on('error', (err) => {
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });
    });
  } catch (error) {
    console.error('Image generation error:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

const generateVoice = async (text, voice = 'alloy', model = 'eleven_monolingual_v1') => {
  try {
    return new Promise((resolve, reject) => {
      // Path to the Python script
      const pythonScript = path.join(__dirname, '../Engine/voice.py');
      const engineDir = path.join(__dirname, '../Engine');
      
      // Check if we're on Windows and use the virtual environment
      const pythonCommand = process.platform === 'win32' 
        ? path.join(engineDir, 'venv', 'Scripts', 'python.exe')
        : 'python3';

      // Spawn Python process with the text as argument
      const pythonProcess = spawn(pythonCommand, [pythonScript, text], {
        cwd: engineDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            // Parse the JSON response from Python
            const result = JSON.parse(output.trim());
            if (result.success) {
              // Return the base64 audio data URL for frontend
              resolve(result.audio_data);
            } else {
              reject(new Error(result.error || 'Python script failed'));
            }
          } catch (parseError) {
            // If JSON parsing fails, assume it's an error message
            reject(new Error(`Failed to parse response: ${output.trim()}`));
          }
        } else {
          reject(new Error(`Python script failed with code ${code}: ${error}`));
        }
      });

      pythonProcess.on('error', (err) => {
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });
    });
  } catch (error) {
    console.error('Voice generation error:', error);
    throw new Error(`Voice generation failed: ${error.message}`);
  }
};

module.exports = {
  generateText,
  generateImage,
  generateVoice
};
