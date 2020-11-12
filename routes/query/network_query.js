const _query = {
   counts: function() {
      var query = 'SELECT count(*) FROM network';
      return query
   },
   selectAll:function(){

      var query = 'SELECT * FROM network_view';
      //var query = 'SELECT * from network;';
      return query;
   },
   siteSelect: function(siteId){
      var _siteId = siteId;

      var query = 'SELECT * FROM network_view WHERE site_id='+_siteId+';';
      return query;
   },
   selectOne:function(seq){
      var _seq = seq;
      var query = 'select * from network where id='+_seq;
      return query;
   },
   insert:function(data){
     var _data = data;
      var _createdDate = _data.createDate || null; 
      var _url = _data.url || null;
      var _port = _data.port || 0;
      var _deviceId = _data.deviceId || 99;
      var _battery_capacity = _data.battery_capacity || null;
      var _max_power = _data.max_power || null;
      var _location = _data.location || null;
      var _siteId = _data.siteId || 0;
      var _deviceIndex = _url.split(".")[0]+_port;
      var _image_path = '"'+_data.image_path+'"' || null
   
      var query = '';
      //upr: id =6;
      if(_deviceId === 3){
         query = 'INSERT INTO network (created_date, url, port, device_id, location, site_id, device_index, image_path, max_power, battery_capacity) VALUES ("'+_createdDate+'", "'+_url+'", '+_port+', '+_deviceId+', "'+_location+'", '+_siteId+', "'+_deviceIndex+'", '+_image_path+', '+_max_power+', '+_battery_capacity+');'
                + 'INSERT INTO ups (created_date, device_idx, site_id, location, max_power, battery_capacity, image_path) VALUES ("'+_createdDate+'","'+_deviceIndex+'", '+_siteId+', "'+_location+'", '+_max_power+', '+_battery_capacity+', '+_image_path+');';
      } else {

       query = 'INSERT INTO network (created_date, url, port, device_id, location, site_id, device_index, image_path ) '
            +'VALUES ("'+_createdDate+'", "'+_url+'", '+_port+', '+_deviceId+', "'+_location+'", '+_siteId+', "'+_deviceIndex+'", '+_image_path+');'
      }
         return query;
   },
   update:function(data){
      var _data = data;
      var _id = _data.id;
      var _modifiedDate = _data.date;
      var _url = _data.url;
      var _port = _data.port;
      var _deviceId = _data.deviceId;
      var _battery_capacity = _data.battery_capacity || null;
      var _max_power = _data.max_power || null;
      var _location = _data.location;
      var _siteId = _data.siteId;
      var _deviceIndex = _url.split(".")[0]+_port;
      var _image_path = '"'+_data.image_path+'"' || null


      var query = 'UPDATE network SET '
                  +'modified_date="'+_modifiedDate+'", '
                  +'url="'+_url+'", '
                  +'port="'+_port+'", '
                  +'device_id='+_deviceId+', '
                  +'location="'+_location+'", '
                  +'site_id='+_siteId+', '
                  +'image_path='+_image_path+', '
                  +'site_id='+_siteId+', '
                  +'battery_capacity='+_battery_capacity+', '
                  +'max_power='+_max_power+' '
                  +'WHERE id='+_id+";"
       return query;

   },
   scanResult: function(data) {
      var _data =data;
      var _id = _data.id;
      var _recordTime =  _data.date;
      var _result = _data.result;
      var _errorTime = _data.errorTime || null;
      var query = 'UPDATE network SET '
                  +'result="'+_result+'", '
                  +'record_time="'+_recordTime+'", '
                  +'error_time='+_errorTime+' '
                  +'WHERE id='+_id+";"
      return query;
   },
   delete:function(id){
      var _id = id;
      var _query = 'DELETE FROM network WHERE id='+_id;

       return _query;

   },
   findGroupBynetwork: function(){
      var query = 'SELECT comp_id, comp_name, site_id AS site_id, site_name, site_url, device_id, device_name, COUNT(device_id) AS device_count FROM network_view GROUP BY site_id, device_id ORDER BY site_id;';

      return query;

   },
   findGroupBynetworkNsite: function(param){
      var _siteId = param;
      var query = 'SELECT comp_id, comp_name, site_id AS site_id, site_name, device_id, device_name, COUNT(device_id) AS device_count FROM network_view GROUP BY site_id, device_id HAVING site_id ='+_siteId+' ORDER BY site_id;';

      return query;

   },
   findSiteBynetwork: function(id){
      var _id = id;
      var query = 'SELECT * FROM network_view WHERE site_id ='+_id;
      return query;

   },
   upsNetworkUpdate: function(data){
      var _data =data;
      var _upsIndex = _data.ups_idx;
      var _recordTime =  _data.recordTime;
      var _result = _data.result;
      var _errorTime = _data.errorTime?'"'+_data.errorTime+'"':null;
      var query = 'UPDATE network SET '
                  +'result="'+_result+'", '
                  +'record_time="'+_recordTime+'", '
                  +'error_time='+_errorTime+' '
                  +'WHERE device_index="'+_upsIndex+'";'
      return query;
   },
   findBydevice: function(param){
       /*
         @table network_view
         @param deviceId
      */
      var _deviceId = param;
      var query = 'SELECT * FROM network_view WHERE device_id ='+_deviceId;
      return query;
   },
   findBydeviceCount: function(){
      /*
         @table network_view
         @comment 
            odms- 전체통계-등록현황 등록 된 장비 수 조회
      */
      var query = 'SELECT device_id, device_name, COUNT(device_id) AS device_count '
                  +'FROM network_view '
                  +'GROUP BY device_id;';
      return query; 
   },
   findBydeviceCountNsiteId: function(param){
      /*
         @table network_view
         @param siteId 현장ID
         @comment 
            odms- 현장별 통계-등록현황 등록 된 장비 수 조회
      */
     var siteId = param;
      var query = 'SELECT device_id, device_name, COUNT(device_id) AS device_count '
                  +'FROM network_view '
                  +'WHERE site_id='+siteId+' '
                  +'GROUP BY device_id;';
      return query; 
   }
}

module.exports=_query;
