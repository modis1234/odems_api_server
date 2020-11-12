const _query = {
   counts: function() {
      var query = 'SELECT count(*) FROM network_error';
      return query
   },
   selectAll:function(){
      return 'SELECT * from network_error;'
   },
   selectOne:function(seq){
      var _seq = seq;
      var query = 'select * from network_error where id='+_seq;
      return query;
   },
   insert:function(data){
      var _data = data;
      var _recordTime = '"'+_data.recordTime+'"' || null;
      var _errorTime = '"'+_data.errorTime+'"' || null;
      var _url = _data.url || null;
      var _port = _data.port || 0;
      var _deviceId = _data.deviceId || 0;
      var _location = _data.location || null;
      var _siteId = _data.siteId || 1;
      var _result = _data.result || null;
      //var _devcieIndex = '"'+_data.ups_idx+'"' || null;
      var _deviceIndex = _data.deviceIndex ? '"'+_data.deviceIndex+'"' : '"'+_data.ups_idx+'"';


      var query = 'INSERT INTO network_error (record_time, error_time, url, port, device_id, location, site_id, result, device_index) '
                  +'VALUES ('+_recordTime+', '+_errorTime+',"'+_url+'", '+_port+', '+_deviceId+', "'+_location+'", '+_siteId+', "'+_result+'", '+_deviceIndex+');';

      return query;
   },
   restoreUpdate:function(data){
      var _data = data;
      //var _recordTime = '"'+_data.recordTime+'"' || null;
      var _errorTime = '"'+_data.errorTime+'"' || null;
      var _restoreTime = '"'+_data.restoreTime+'"' || null;
      var _result = _data.result;
      var _url = _data.url;
      var _port = _data.port;
      var _count = _data.count || 0;

      var query = 'UPDATE network_error SET '
              //  +'record_time='+_recordTime+', '
                +'restore_time='+_restoreTime+', '
                +'count='+_count+', '
                +'result="'+_result+'" '
                +'WHERE error_time='+_errorTime+' AND port="'+_port+'";';
      return query;
   },
   delete:function(id){
      var _id = id;
      var _query = 'DELETE FROM network_error WHERE id='+_id;

       return _query;

   },
   findBysite:function(param){
      var _siteId = param;
      var query = 'select * from network_error where site_id='+_siteId;
      return query;
   },
   findBylocation: function(param){
      var _siteId = param;
       var query = 'SELECT * FROM error_location_view WHERE site_id='+_siteId+' ORDER BY device_name ASC';
       return query;
   },
   findBylocationAll: function(){
      var query = 'SELECT * FROM error_location_view ORDER BY device_name ASC';
       return query;
   },
   //기간조회
   findByTerm: function(data){
      /*
         @table error_site_view
         @data startDate
         @data endDate 
      */
      var _data = data;
      var _startDate = _data.startDate;
      var _endDate = _data.endDate;

      var query = 'SELECT * FROM ( '
                  +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
                  +'FROM error_site_view'
                  +') err ' 
                  +'WHERE DATE_FORMAT(error_time,"%Y-%m-%d %H:%i:%S") '
                  +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                  +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                  +'AND period>60 '
                  +'ORDER BY location ASC, error_time ASC;'
      return query;
   },
   //기간&건설사
   findByTermNCompany: function(data){
      /*
         @table error_site_view
         @data startDate
         @data endDate
         @data companyId 
      */
      var _data = data;
      var _startDate = _data.startDate;
      var _endDate = _data.endDate;
      var _companyId = _data.companyId;

      var query = 'SELECT * FROM ( '
                  +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
                  +'FROM error_site_view'
                  +') err ' 
                  +'WHERE DATE_FORMAT(error_time,"%Y-%m-%d %H:%i:%S") '
                  +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                  +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                  +'AND comp_id='+_companyId+' '
                  +'AND period>60 '
                  +'ORDER BY location ASC, error_time ASC;'
      return query;
   },
   //기간&현장
   findBytermNsiteId: function(data){
       /*
         @table error_site_view
         @data startDate
         @data endDate
         @data siteId
      */
      var _data = data;
      var _startDate = data.startDate;
      var _endDate = data.endDate;
      var _siteId = data.siteId;

      var query = 'SELECT * FROM ('
               +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
               +'FROM error_site_view'
               +') err ' 
               +'WHERE (DATE_FORMAT(error_time,"%Y-%m-%d %H:%i:%S") '
               +'BETWEEN DATE_FORMAT("'+_startDate+'", "%Y-%m-%d %H:%i:%S") '
               +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S")) '
               +'AND site_id ='+_siteId+' '
               +'AND period>60 '
               +'ORDER BY location ASC, error_time ASC;';

      return query;
   },
   //기간&장비타입
   findByTermNdevcie: function(data){
      /*
         @table error_site_view
         @data startDate
         @data endDate
         @data deviceId
      */
     var _data = data;
     var _startDate = _data.startDate;
     var _endDate = _data.endDate;
     var _deviceId = _data.deviceId;

     var query = 'SELECT * FROM ( '
                 +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
                 +'FROM error_site_view'
                 +') err ' 
                 +'WHERE DATE_FORMAT(error_time,"%Y-%m-%d %H:%i:%S") '
                 +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                 +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                 +'AND device_id='+_deviceId+' '
                 +'AND period>60 '
                 +'ORDER BY location ASC, error_time ASC;';
      return query;
   },
   //기간&건설사&현장
   findByTermNcompanyNsite: function(data){
      /*
         @table error_site_view
         @data startDate
         @data endDate
         @data companyId
         @data siteId
      */
     var _data = data;
     var _startDate = _data.startDate;
     var _endDate = _data.endDate;
     var _companyId = _data.companyId;
     var _siteId = _data.siteId;

     var query = 'SELECT * FROM ( '
                 +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
                 +'FROM error_site_view'
                 +') err ' 
                 +'WHERE DATE_FORMAT(error_time,"%Y-%m-%d %H:%i:%S") '
                 +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                 +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                 +'AND comp_id='+_companyId+' '
                 +'AND site_id='+_siteId+' '
                 +'AND period>60 '
                 +'ORDER BY location ASC, error_time ASC;';
      return query;
   },
   //기간&건설사&장비
   findByTermNcompanyNdevcie: function(data){
      /*
         @table error_site_view
         @data startDate
         @data endDate
         @data companyId
         @data deviceId
      */
     var _data = data;
     var _startDate = _data.startDate;
     var _endDate = _data.endDate;
     var _companyId = _data.companyId;
     var _deviceId = _data.deviceId;

     var query = 'SELECT * FROM ( '
                 +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
                 +'FROM error_site_view'
                 +') err ' 
                 +'WHERE DATE_FORMAT(error_time,"%Y-%m-%d %H:%i:%S") '
                 +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                 +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                 +'AND comp_id='+_companyId+' '
                 +'AND device_id='+_deviceId+' '
                 +'AND period>60 '
                 +'ORDER BY location ASC, error_time ASC;';
      return query;      
   },
   //기간&현장&장비
   findBytermNdeviceNsiteId: function(data){
      /*
         @table error_site_view
         @data startDate
         @data endDate
         @data siteId
         @data deviceId
      */
      var _data = data;
      var _startDate = data.startDate;
      var _endDate = data.endDate;
      var _siteId = data.siteId;
      var _deviceId = data.deviceId;

      var query = 'SELECT * FROM ( '
               +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
               +'FROM error_site_view'
               +') err ' 
               +'WHERE (DATE_FORMAT(error_time,"%Y-%m-%d %H:%i:%S") '
               +'BETWEEN DATE_FORMAT("'+_startDate+'", "%Y-%m-%d %H:%i:%S") '
               +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S")) '
               +'AND site_id ='+_siteId+' '
               +'AND device_id='+_deviceId+' '
               +'AND period>60 '
               +'ORDER BY location ASC, error_time ASC;';

      return query;
   },
   //기간&건설사&현장&장비
   findByTermNcompanyNsiteNdevcie: function(data){
      /*
         @table error_site_view
         @data startDate
         @data endDate
         @data companyId
         @data siteId
         @data deviceId
      */
     var _data = data;
     var _startDate = _data.startDate;
     var _endDate = _data.endDate;
     var _companyId = _data.companyId;
     var _siteId = _data.siteId;
     var _deviceId = _data.deviceId;

     var query = 'SELECT * FROM ( '
                 +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
                 +'FROM error_site_view'
                 +') err ' 
                 +'WHERE DATE_FORMAT(error_time,"%Y-%m-%d %H:%i:%S") '
                 +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                 +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                 +'AND comp_id='+_companyId+' '
                 +'AND site_id ='+_siteId+' '
                 +'AND device_id='+_deviceId+' '
                 +'AND period>60 '
                 +'ORDER BY location ASC, error_time ASC;';
      return query; 
   },
   // groupBysiteNdevcie:function(data){
   //    /*
   //       @table error_site_view
   //       @data startDate
   //       @data endDate
   //    */
   //    var _data = data;
   //    var _fromDate = _data.startDate;
   //    var _toDate = _data.endDate;

   //    var query = 'SELECT site_id AS site_id, site_name, site_url, device_id, COUNT(device_id) AS error_count '
   //              +'FROM error_site_view ' 
   //              +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") ' 
   //              +'BETWEEN DATE_FORMAT("'+_fromDate+'","%Y-%m-%d %H:%i:%S") ' 
   //              +'AND DATE_FORMAT("'+_toDate+'","%Y-%m-%d %H:%i:%S")'
   //              +'GROUP BY site_id, device_id;';

   //    return query;
   // },
   groupBysiteNdevcie:function(data){
      /*
         @table error_site_view
         @data startDate
         @data endDate
      */
  
      var _data = data;
      var _fromDate = _data.startDate;
      var _toDate = _data.endDate;
      var query = 'SELECT site_id AS site_id, site_name, site_url, device_id, COUNT(device_id) AS error_count '
                +'FROM ('
                +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
                +'FROM error_site_view'
                +') err ' 
                +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") ' 
                +'BETWEEN DATE_FORMAT("'+_fromDate+'","%Y-%m-%d %H:%i:%S") ' 
                +'AND DATE_FORMAT("'+_toDate+'","%Y-%m-%d %H:%i:%S") '
                +'AND period>60 '
                +'GROUP BY site_id, device_id;';

      return query;
   },
   groupBysiteNdevcie:function(data){
      /*
         @table error_site_view
         @data startDate
         @data endDate
      */
  
      var _data = data;
      var _fromDate = _data.startDate;
      var _toDate = _data.endDate;
      var query = 'SELECT site_id AS site_id, site_name, site_url, device_id, COUNT(device_id) AS error_count, COUNT(restore_time) AS restore_count '
                +'FROM ('
                +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
                +'FROM error_site_view'
                +') err ' 
                +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") ' 
                +'BETWEEN DATE_FORMAT("'+_fromDate+'","%Y-%m-%d %H:%i:%S") ' 
                +'AND DATE_FORMAT("'+_toDate+'","%Y-%m-%d %H:%i:%S") '
                +'AND period>60 '
                +'GROUP BY site_id, device_id;';

      return query;
   },
   groupBysiteNdevcieFindBysiteId: function(data){
      var _data = data;
      var _fromDate = _data.startDate;
      var _toDate = _data.endDate;
      var _siteId = _data.siteId;
      var query = 'SELECT site_id AS site_id, site_name, site_url, device_id, COUNT(device_id) AS error_count '
                +'FROM ('
                +'SELECT *, IF(restore_time, TIMESTAMPDIFF(SECOND,error_time, restore_time), TIMESTAMPDIFF(SECOND,error_time, NOW()) ) AS period '
                +'FROM error_site_view'
                +') err ' 
                +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") ' 
                +'BETWEEN DATE_FORMAT("'+_fromDate+'","%Y-%m-%d %H:%i:%S") ' 
                +'AND DATE_FORMAT("'+_toDate+'","%Y-%m-%d %H:%i:%S") '
                +'AND period>60 '
                +'AND site_id='+_siteId+' '
                +'GROUP BY site_id, device_id;';

      return query;

   }
   
}

module.exports=_query;
