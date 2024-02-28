const fs = require('fs');

class JsonManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  fileExists() {
    try {
      fs.accessSync(this.filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  // 파일이 없을 경우 초기 데이터로 새로 생성
  initializeFile(initialData) {
    try {
      const jsonString = JSON.stringify(initialData, null, 2);
      fs.writeFileSync(this.filePath, jsonString);
      console.log('File initialized with default data.');
    } catch (error) {
      console.error('Error initializing file:', error);
    }
  }

  // 파일에서 JSON 데이터 읽기
  readJson() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      return null;
    }
  }

  // JSON 데이터 파일에 쓰기
  writeJson(data) {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      fs.writeFileSync(this.filePath, jsonString);
      console.log('Data saved to JSON file');
    } catch (error) {
      console.error('Error writing JSON file:', error);
    }
  }

  // 특정 필드 업데이트
  updateField(fieldName, newValue) {
    const jsonData = this.readJson();
    if (jsonData) {
      jsonData[fieldName] = newValue;
      this.writeJson(jsonData);
    }
  }
  
  removeField(fieldName) {
    const jsonData = this.readJson();
    if (jsonData && jsonData.hasOwnProperty(fieldName)) {
      delete jsonData[fieldName];
      this.writeJson(jsonData);
      console.log(`Field '${fieldName}' removed from JSON file.`);
    } else {
      console.log(`Field '${fieldName}' not found in JSON file.`);
    }
  }
}

module.exports = JsonManager;