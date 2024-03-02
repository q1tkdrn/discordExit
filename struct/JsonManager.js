const fs = require('fs').promises;

class JsonManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  fileExists() {
    return fs.access(this.filePath)
      .then(() => true)
      .catch(() => false);
  }

  // 파일이 없을 경우 초기 데이터로 새로 생성
  initializeFile(data) {
    return fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8')
      .catch((error) => {
        console.error('JSON 파일 쓰기 중 오류 발생:', error);
        throw error;
      });
  }

  // 파일에서 JSON 데이터 읽기
  readJson() {
    return fs.readFile(this.filePath, 'utf-8')
      .then((data) => {
        return JSON.parse(data);
      })
      .catch((error) => {
        console.error('JSON 파일 읽기 중 오류 발생:', error);
        throw error;
      });
  }

  // JSON 데이터 파일에 쓰기
  writeJson(data) {
    return fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8')
      .catch((error) => {
        console.error('JSON 파일 쓰기 중 오류 발생:', error);
        throw error;
      });
  }

  // 특정 필드 업데이트 - Promise를 반환하도록 수정
  updateField(fieldName, newValue) {
    return this.readJson()
      .then((jsonData) => {
        if (jsonData) {
          jsonData[fieldName] = newValue;
          return this.writeJson(jsonData);
        } else {
          throw new Error('필드 업데이트 실패. JSON 데이터를 읽을 수 없습니다.');
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  removeField(fieldName) {
    return this.readJson()
      .then((jsonData) => {
        if (jsonData && jsonData.hasOwnProperty(fieldName)) {
          delete jsonData[fieldName];
          return this.writeJson(jsonData);
        } else {
          console.log(`JSON 파일에서 '${fieldName}' 필드를 찾을 수 없습니다.`);
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}

module.exports = JsonManager;