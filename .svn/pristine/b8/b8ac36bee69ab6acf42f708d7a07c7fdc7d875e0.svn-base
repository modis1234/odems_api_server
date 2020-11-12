const _query = {
   counts: function() {
      var query = 'SELECT count(*) FROM ups';
      return query
   },
   selectAll: function(){
      return 'SELECT * FROM ups_site_view';
   },
   selectOne: function(id){
      var _id = id;
      var query = 'SELECT * FROM ups where id='+_id;
      return query;
   },
   siteSelect: function(siteId){
      var _siteId = siteId;

      var query = 'SELECT * FROM ups WHERE site_id='+_siteId+';';
      return query;
   },
   selectNetworkInfo: function(){
      var query = 'SELECT * FROM network_ups_view';
      return query;
   },
   insert: function(data){
      var _data = data;
      var _createdDate = _data.createDate;
      var _localIdx = _data.localIdx;
      var _companyId = _data.companyId;
      var _location = _data.location;


      var query = 'INSERT INTO ups (create_date, local_idx, company_id, location) VALUES ("'+_createdDate+'","'+_localIdx+'", '+_companyId+', "'+_location+'"); ';

      return query;
   },
   update: function(data){
      var _data = data;
      var _id = _data.id;
      var _modifiedDate = _data.date;
      var _url = _data.url;
      var _port = _data.port;
      var _deviceIdx = '"'+_data.device_index+'"';
      var _batteryCapacity = _data.battery_capacity || null;
      var _maxPower = _data.max_power || null;
      var _siteId = _data.siteId; 
      var _image_path = '"'+_data.image_path+'"' || null;
      var _location = '"'+_data.location+'"'

     
     var query = 'UPDATE ups SET '
               +'modified_date="'+_modifiedDate+'", '
               +'site_id='+_siteId+', '
               +'location='+_location+', '
               +'battery_capacity='+_batteryCapacity+', '
               +'max_power='+_maxPower+', '
               +'image_path='+_image_path+' '
               +'WHERE device_idx='+_deviceIdx+';';

     return query;
   },
   recordUpdate: function(data){
      var _data = data;
      var _id = data.id;
      var _recordTime = data.recordTime;
      var _deviceIdx = data.ups_idx;
      var _voltIn = data.volt_in;
      var _voltOut = data.volt_out;
      var _freqIn = data.freq_in;
      var _freqOut = data.freq_out;
      var _loaded = data.loaded;
      var _batteryRemain = data.battery_remain;
      var _stateBattery = data.state_battery;
      var _stateLine = data.state_line;
      var _stateAVR = data.state_avr;
      var _errorType = data.errorType || 0;
      var _useTime=(_errorType === 1) ? data.useTime : 0;
      
      var query = 'UPDATE ups SET '
            +'volt_in='+_voltIn+', '
            +'volt_out='+_voltOut+', '
            +'freq_in='+_freqIn+', '
            +'freq_out='+_freqOut+', '
            +'loaded='+_loaded+', '
            +'battery_remain='+_batteryRemain+', '
            +'state_battery='+_stateBattery+', '
            +'state_line='+_stateLine+', '
            +'state_avr='+_stateAVR+', '
            +'error_type='+_errorType+', '
            +'use_time='+_useTime+', '
            +'record_time="'+_recordTime+'" '
            +'WHERE device_idx = "'+_deviceIdx+'";'
      return query

   },
   delete: function(deviceIndex){
      var _deviceIndex = '"'+deviceIndex+'"';
      
      var query = 'DELETE FROM ups where device_idx='+_deviceIndex;
      return query;
   },
   network_record: function(){

   },
   insert_log: function(data){
      var _data = data;
      //console.log(">>>",_data);

      var _recordTime = data.recordTime;
      var _upsIdx = _data.ups_idx;
      var _voltIn = _data.volt_in;
      var _voltOut = _data.volt_out;
      var _freqIn = _data.freq_in;
      var _freqOut = _data.freq_out;
      var _loaded = _data.loaded;
      var _batteryRemain = _data.battery_remain;
      var _stateBattery = _data.state_battery;
      var _stateLine = _data.state_line;
      var _stateAVR = _data.state_avr;
      var _upsStatus  = _data.upsStatus || 0;
      var _useTime = _data.useTime || 0;

      var query = 'INSERT INTO ups_log '
                  +'(record_time, ups_idx, volt_in, volt_out, freq_in, freq_out, loaded, '
                  +'battery_remain, state_battery, state_line, state_avr, ups_status, use_time) '
                  +'VALUES ("'+_recordTime+'", "'+_upsIdx+'", '+_voltIn+', '+_voltOut+', '+_freqIn+', '+_freqOut+', '+_loaded+', '+_batteryRemain+', '+_stateBattery+', '+_stateLine+', '+_stateAVR+', '+_upsStatus+', '+_useTime+');'
      return query

   },
   error_blackout: function(data){
      var _data = data;

      var _recordTime = data.recordTime;  //이벤트 발생시간
      var _restoreTime = _data.restoreTime || null; //복구시간
      var _localIndex = _data.local_idx; 
      var _upsIdx = _data.ups_idx;    
      var _loaded = _data.loaded;
      var _batteryRemain = _data.battery_remain;
      var _stateBattery = _data.state_battery;
      var _stateLine = _data.state_line;
      var _stateAVR = _data.state_avr; //
      var _useTime = _data.useTime; //배터리 사용가능시간
      var _blackoutTime = _data.blackoutTime; //정전시간
      var _dischargeTime = _data.dischargeTime || null; //방전시간
      var _errorType = 1;  //0: 정상, 1:정전, 2:방전
      var _siteId = _data.site_id;
      var _location = _data.location;
      
      var query = 'INSERT INTO ups_error '
                 +'(record_time, restore_time, ups_idx, local_idx, loaded, battery_remain, state_battery, state_line, state_avr, ' 
                 +'use_time, blackout_time, discharge_time, error_type, site_id, location) '
                 +'VALUES ("'+_recordTime+'", null, "'+_upsIdx+'", "'+_localIndex+'",'+_loaded+', '+_batteryRemain+', '+_stateBattery+', '
                 +_stateLine+', '+_stateAVR+', '+_useTime+', "'+_blackoutTime+'", null, '+_errorType+', '+_siteId+', "'+_location+'");';
      return query;
      
   },
   error_discharge: function(data){
      var _data = data;
     // var _recordTime = data.recordTime;  //이벤트 발생시간
      var _localIndex = _data.local_idx; 
      var _upsIdx = _data.ups_idx;    
      var _loaded = _data.loaded;
      var _batteryRemain = _data.battery_remain;
      var _stateBattery = _data.state_battery;
      var _stateLine = _data.state_line;
      var _stateAVR = _data.state_avr; //
      var _useTime = _data.useTime; //배터리 사용가능시간
      var _blackoutTime = _data.blackoutTime; //정전시간
      var _dischargeTime = _data.dischargeTime || null; //방전시간
      var _errorTime = _data.dischargeTime || null; //네트워크 장애 시간
      var _errorType = 2;  //0: 정상, 1:정전, 2:방전

      var query ='UPDATE ups_error '
            +'SET discharge_time="'+_dischargeTime+'", loaded='+_loaded+', '
            +'battery_remain='+_batteryRemain+', state_line='+_stateLine+', error_type='+_errorType+', '
            +'error_time='+_errorTime+', '
            +'WHERE DATE_FORMAT(blackout_time, "%Y-%m-%d %H:%i:%S") = DATE_FORMAT("'+_blackoutTime+'","%Y-%m-%d %H:%i:%S");';
      return query;

   },
   error_network: function(data){
      var _data = data;
      var _recordTime = data.recordTime;  //이벤트 발생시간
      var _restoreTime = _data.restoreTime || null; //복구시간
      var _localIndex = _data.local_idx; 
      var _upsIdx = _data.ups_idx;    
      var _stateLine = 0;
      var _errorTime = _data.errorTime; // 네트워크 장애 시간
      var _errorType = 3;  //0: 정상, 1:정전, 2:방전
      var _siteId = _data.site_id;
      var _location = _data.location;

      var query = 'INSERT INTO ups_error '
                 +'(record_time, restore_time, error_time, ups_idx, local_idx, state_line, error_type, site_id, location) '
                 +'VALUES ("'+_recordTime+'", null, "'+_errorTime+'", "'+_upsIdx+'", "'+_localIndex+'", '+_stateLine+', '+_errorType+', '+_siteId+', "'+_location+'");';
      return query;
     
   },
   error_restore: function(data){
      var _data =data;
      //var _recordTime = data.recordTime;  // 이벤트 발생
      var _restoreTime = _data.restoreTime || null; //복구시간
      var _loaded = _data.loaded;
      var _batteryRemain = _data.battery_remain;
      var _stateLine = _data.state_line;
      var _useTime = _data.useTime; //배터리 사용가능시간
      var _blackoutTime = _data.blackoutTime; //정전시간
      var _errorType = _data.errorType;  //0: 정상, 1:정전, 2:방전

      var query ='UPDATE ups_error '
               +'SET restore_time="'+_restoreTime+'", loaded='+_loaded+', '
               +'battery_remain='+_batteryRemain+', state_line='+_stateLine+', error_type='+_errorType+' '
               +'WHERE DATE_FORMAT(blackout_time, "%Y-%m-%d %H:%i:%S") = DATE_FORMAT("'+_blackoutTime+'","%Y-%m-%d %H:%i:%S");';
      return query;
    },
    network_restore: function(data){
      var _data =data;
     // var _recordTime = data.recordTime;  // 이벤트 발생
      var _restoreTime = _data.restoreTime || null; //복구시간
      var _stateLine = 0;
      var _errorTime = _data.errorTime; //정전시간
      var _errorType = 3;  //0: 정상, 1:정전, 2:방전
      console.log('1.data--->>>>', data);
      var query ='UPDATE ups_error '
               +'SET restore_time="'+_restoreTime+'", '
               +'state_line='+_stateLine+', error_type='+_errorType+' '
               +'WHERE DATE_FORMAT(error_time, "%Y-%m-%d %H:%i:%S") = DATE_FORMAT("'+_errorTime+'","%Y-%m-%d %H:%i:%S");';
      return query;
    },
    upsDeviceSelect: function(siteId){
      var _siteId = siteId;
      var query ='SELECT * FROM ups_device_view WHERE site_id='+_siteId;
      return query;
   },
   errorfindBytermNlocalIndex: function(data){
      var _data= data;
      var _startDate = data.startDate;
      var _endDate = data.endDate;
      var _localIndex = data.localIndex;
      console.log(data);
      var query = 'SELECT * FROM ups_error '
      +'WHERE (DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
      +'BETWEEN DATE_FORMAT("'+_startDate+'", "%Y-%m-%d %H:%i:%S") '
      +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S")) AND local_idx ="'+_localIndex+'" ORDER BY record_time asc;';

      return query;
    
      
   },
   errorfindBytermNlocalIndexNupsIndex: function(data){
      var _data= data;
      var _startDate = data.startDate;
      var _endDate = data.endDate;
      var _localIndex = data.localIndex;
      var _upsIndex = data.upsIndex; 

      var query = 'SELECT * FROM ups_error '
      +'WHERE (DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
      +'BETWEEN DATE_FORMAT("'+_startDate+'", "%Y-%m-%d %H:%i:%S") '
      +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S")) AND ups_idx="'+_upsIndex+'" AND local_idx ="'+_localIndex+'" ORDER BY record_time asc;';

      return query;

   },
   upsCurrentView: function(){
      var query = 'SELECT * FROM ups_error_view;';
      
      return query;
   },
   //기간조회
   findByTerm: function(data){
      /*
         @table upserror_site_view
         @data startDate
         @data endDate 
      */
      var _data = data;
      var _startDate = _data.startDate;
      var _endDate = _data.endDate;

      var query = 'SELECT * FROM upserror_site_view '
                  +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
                  +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                  +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                  +'ORDER BY record_time ASC;'
      return query;
   },
   //기간&건설사
   findByTermNCompany: function(data){
      /*
         @table upserror_site_view
         @data startDate
         @data endDate
         @data companyId 
      */
      var _data = data;
      var _startDate = _data.startDate;
      var _endDate = _data.endDate;
      var _companyId = _data.companyId;

      var query = 'SELECT * FROM upserror_site_view '
                  +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
                  +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                  +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                  +'AND comp_id='+_companyId+' '
                  +'ORDER BY record_time ASC;'
      return query;
   },
   //기간&현장
   findBytermNsiteId: function(data){
       /*
         @table upserror_site_view
         @data startDate
         @data endDate
         @data siteId
      */
      var _data = data;
      var _startDate = data.startDate;
      var _endDate = data.endDate;
      var _siteId = data.siteId;

      var query = 'SELECT * FROM upserror_site_view '
               +'WHERE (DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
               +'BETWEEN DATE_FORMAT("'+_startDate+'", "%Y-%m-%d %H:%i:%S") '
               +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S")) '
               +'AND site_id ='+_siteId+' '
               +'ORDER BY record_time ASC;';

      return query;
   },
   //기간&설치위치
   findByTermNlocation: function(data){
      /*
         @table upserror_site_view
         @data startDate
         @data endDate
         @data location
      */
     var _data = data;
     var _startDate = _data.startDate;
     var _endDate = _data.endDate;
     var _location = _data.location;

     var query = 'SELECT * FROM upserror_site_view '
                 +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
                 +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                 +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                 +'AND location like "%'+_location+'%" '
                 +'ORDER BY record_time ASC;';
      return query;
   },
   //기간&건설사&현장
   findByTermNcompanyNsite: function(data){
      /*
         @table upserror_site_view
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

     var query = 'SELECT * FROM upserror_site_view '
                 +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
                 +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                 +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                 +'AND comp_id='+_companyId+' '
                 +'AND site_id='+_siteId+' '
                 +'ORDER BY record_time ASC;';
      return query;
   },
   //기간&건설사&설치위치
   findByTermNcompanyNlocation: function(data){
      /*
         @table upserror_site_view
         @data startDate
         @data endDate
         @data companyId
         @data location
      */
     var _data = data;
     var _startDate = _data.startDate;
     var _endDate = _data.endDate;
     var _companyId = _data.companyId;
     var _location = _data.location;

     var query = 'SELECT * FROM upserror_site_view '
                 +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
                 +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                 +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                 +'AND comp_id='+_companyId+' '
                 +'AND location like "%'+_location+'%" '
                 +'ORDER BY record_time ASC;';
      return query;      
   },
   //기간&현장&설치위치
   findBytermNlocationNsiteId: function(data){
      /*
         @table upserror_site_view
         @data startDate
         @data endDate
         @data siteId
         @data location
      */
      var _data = data;
      var _startDate = data.startDate;
      var _endDate = data.endDate;
      var _siteId = data.siteId;
      var _location = data.location;

      var query = 'SELECT * FROM upserror_site_view '
               +'WHERE (DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
               +'BETWEEN DATE_FORMAT("'+_startDate+'", "%Y-%m-%d %H:%i:%S") '
               +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S")) '
               +'AND site_id ='+_siteId+' '
               +'AND location like "%'+_location+'%" '
               +'ORDER BY record_time ASC;';

      return query;
   },
   //기간&건설사&현장&설치위치
   findByTermNcompanyNsiteNlocation: function(data){
      /*
         @table upserror_site_view
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
     var _location = _data.location;

     var query = 'SELECT * FROM upserror_site_view '
                 +'WHERE DATE_FORMAT(record_time,"%Y-%m-%d %H:%i:%S") '
                 +'BETWEEN DATE_FORMAT("'+_startDate+'","%Y-%m-%d %H:%i:%S") '
                 +'AND DATE_FORMAT("'+_endDate+'","%Y-%m-%d %H:%i:%S") ' 
                 +'AND comp_id='+_companyId+' '
                 +'AND site_id ='+_siteId+' '
                 +'AND location like "%'+_location+'%" '
                 +'ORDER BY record_time ASC;';
      return query; 
   },

}

module.exports=_query;
