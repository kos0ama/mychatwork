const request = require('request');

exports.handler = function(event, context, callback) {        
    console.log('Received event:', JSON.stringify(event, null, 2));
    // Retrieve request parameters from the Lambda function input:
    var signature = event.headers['X-ChatWorkWebhookSignature'];
    var body = event.body;
 
    if (validate(signature, body)) {
        // Webhookで行いたい処理
        callback(null, {"statusCode": 200, "body": "Success"})
        // ##############################################
        
        // 本文の成形
          var message = '@channel:' + "\n";
          message += '*' + '123' + '*';
          
        
          // WebHookのURLをここに入れます
          var slackWebhookUrl = 'https://hooks.tocaro.im/integrations/inbound_webhook/fn5hi1axwhqqeaanffxzca1sssffkbs6';
        
          // リクエスト設定
          const options = {
            url: slackWebhookUrl,
            headers: {
              'Content-type': 'application/json'
            },
            body: {
              "text": message
            },
            json: true
          };
        
          // メッセージ送信
          request.post(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
              context.done(null, body);
            } else {
              console.log('error: ' + response.statusCode);
              context.done(null, 'error');
            }
          });
        // ##############################################
    
    }  else {
        callback(null, {"statusCode": 403, "body": "Forbidden"})    }
}
 
var validate = function(signature, body){
    var cipheredBody = digest(body);
    return cipheredBody === signature;
}
 
var digest = function(value){
    var secret = decode(process.env.TOKEN);
    var crypto = require('crypto');
    var hash = crypto.createHmac('SHA256', secret).update(value).digest('base64');
    return hash;
}
 
var encode = function(value){
    var buffer = new Buffer(value);
    var encoded = buffer.toString('base64');
    return encoded;
}
 
var decode = function(value){
    var buffer = new Buffer(value, 'base64');
    return buffer;
}