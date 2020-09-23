# quizzical

This is a bare-bones, JSON-based quizzing system based on the *New York Times* [weekly news quiz](https://www.nytimes.com/spotlight/news-quiz).

## system requirements

+ A web server with [PHP](https://php.net) support.
+ A Google [Firebase account](https://console.firebase.google.com) (free).
+ Comfort editing JSON files.

## installation

+ Upload the files to a folder on your web server.
+ Add the following line to your `.htaccess` file if you want quizzical to be accessible in a folder without specifying the file `q.php`:
```
DirectoryIndex index.php q.php
```
