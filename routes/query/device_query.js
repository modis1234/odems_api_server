const _query = {
   counts: function() {
      var query = 'SELECT count(*) FROM device';
      return query
   },
   selectAll: function(){
      return 'SELECT * FROM device ORDER BY device_name ASC;';
   },
   selectOne: function(id){
      var _id = id;
      var query = 'SELECT * FROM device where id='+_id;
      return query;
   },
   insert: function(data){
      var _data = data;
      var _deviceName = _data.deviceName;

      var query = 'INSERT INTO device (device_name) VALUES ("'+_deviceName+'"); ';

      return query;
   },
   update: function(data){
     var _data = data;
     var _id = _data.id;
     var _deviceName = _data.deviceName;
     
     var query = 'UPDATE device SET device_name="'+_deviceName+'" WHERE id='+_id+';';

     return query;

   },
   delete: function(id){
      var _id = id;
      
      var query = 'DELETE FROM device where id='+id;
      return query;
   },
   checked: function(data) {
      var _data = data;
      var _deviceName = data.deviceName;
      var query = 'SELECT id, COUNT(*) AS count FROM device WHERE device_name = "'+_deviceName+'";';

      return query;
  }
}

module.exports=_query;
