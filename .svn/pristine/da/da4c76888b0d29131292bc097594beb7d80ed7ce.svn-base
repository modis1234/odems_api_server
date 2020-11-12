const _query = {
    counts: function() {
       var query = 'SELECT count(*) FROM ups_alarm_view';
       return query
    },
    selectAll: function(){
       return 'SELECT * FROM ups_alarm_view';
    },
    selectOne: function(id){
       var _id = id;
       var query = 'SELECT * FROM ups_alarm_view where id='+_id;
       return query;
    },
    selectSite: function(siteId){
        var _siteId = siteId;
        var query = 'SELECT * FROM ups_alarm_view WHERE site_id ='+_siteId+'AND sms_yn = "Y";';
        return query;
    },
    selectDeviceIdx: function(deviceIndex){
         var _deviceIndex = deviceIndex;
         var query = 'SELECT * FROM ups_alarm_view WHERE device_idx ="'+_deviceIndex+'" AND sms_yn = "Y";';
         return query;
    }
 }
 
 module.exports=_query;
 