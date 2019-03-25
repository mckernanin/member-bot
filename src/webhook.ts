// 1. get characters in corp from API
// 2. compare with database
//    2a. if no difference, exit
//    2b. if changes, write changes to DB
// 3. if new characters, reqeust public character api
// 4. post to webhook with new characters + characters that have left
