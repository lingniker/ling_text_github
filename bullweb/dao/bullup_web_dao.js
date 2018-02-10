var mysql = require('mysql');
var async = require('async');


// var mysqlServerConfig = {
//     host:'18.221.98.48',
//     user: 'root',
//     password: '1234',
//     database: 'bullup',
//     useConnectionPooling: true
// };

var pool = mysql.createPool({  
    host:'192.168.2.102',
    user: 'root',
    password: 'Caoxijiang',
    database: 'bullupNew',
    port: 3306  
}); 
exports.createConnection = function(callback){
    var blank = {};
    callback(blank);
}

exports.closeConnection = function(connection){
    //connection.end();
}



exports.query = function(connection, sql, values, callback){

    pool.getConnection(function(err,conn){  
        if(err){  
            callback(err,null);  
        }else{  
            conn.query(sql, values,function(err,results){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(err,results);  
            });  
        }  
    });  
};


exports.addDate = function(userInfo, callback) {
    exports.createConnection(function(connection){
        async.waterfall([
            function(callback){
                exports.query(connection, 'select * from bullup_web where id = (select max(id) from bullup_web)', [], function (err, results){
                    if (err) throw err;
                    exports.closeConnection(connection);
                    //console.log("---",results);
                    callback(null,results);
                });
            },
            function(data,callback){
               //console.log("user",userInfo);
               //console.log("data",data);
               if(!data[0]){
                 var pv_count = 0;
                 var uv_count = 0;
                 var all_count = 0;
                 var bullup_day = Math.floor(new Date().getTime()/1000/60/60/24);
               }else{
                 var pv_count = data[0].pv_count;
                 var uv_count = data[0].uv_count;
                 var all_count = data[0].all_count;
                 var bullup_day = data[0].bullup_day;
               }
               
               if(userInfo.bullup_day>bullup_day){
                   pv_count=0;
                   uv_count=0;
               }
               if(userInfo.increase_uv == 1){
                    uv_count++;                    
               }else if(userInfo.increase_uv == 2){
                    uv_count++;
                    all_count++;
               }               
               pv_count++;
               console.log(pv_count,uv_count,all_count);
               exports.query(connection, 'insert into `bullup_web` (ip, country, province, city, time, bullup_day, pv_count, uv_count,all_count) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [userInfo.ip,userInfo.acountry ,userInfo.province,userInfo.city,userInfo.time,userInfo.bullup_day,pv_count,uv_count,all_count], function (err, rows) {
                    if (err) {
                        throw err;//connection.rollback();
                    }
                    if(rows.affectedRows > 0){
                        console.log("rows",rows);
                        callback(null, data);
                    }
                });
               //callback(null,data);
            }
        ],    
        function(err, result){
            if(err) console.log(err);
            exports.closeConnection(connection);
            callback(result);
        });
    });
}