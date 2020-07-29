let db;
const request = window.indexedDB.open("budget", 1);
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      db.createObjectStore("pending", { autoIncrement: true });
    };

    request.onerror = function(event) {
      console.log("Error! " + event.target.errorCode);
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      
      if (navigator.online) {
          checkDatabase();      
        }
    };

      
      
     
      
    

