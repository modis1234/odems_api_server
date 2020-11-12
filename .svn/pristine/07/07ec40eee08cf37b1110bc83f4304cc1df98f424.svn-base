const _query = {
    counts: function() {
       var query = 'SELECT count(*) FROM hds_account';
       return query
    },
    selectAll: function(){
       return 'SELECT * FROM hds_account';
    },
    selectOne: function(id){
       var _id = id;
       var query = 'SELECT * FROM hds_account where id='+_id;
       return query;
    },
    login: function(data){
        var _data = data;
        var _userId = _data.userId;
        var _password = _data.password;
        var query = 'SELECT * FROM hds_account WHERE user_id = "'+_userId+'";';
        return query;
    },
    sign_up: function(data){
      var _data = data;
      var _createdDate = _data.createdDate;
      var _userId = _data.userId;
      var _name = _data.name;
      var _password = _data.password;
      var _email = _data.email;
      var _tel = _data.tel;
      var _role = _data.role || 0;
      var _smsYN = _data.smsYN || 'N';


      var query = 'INSERT INTO hds_account (created_date, user_id, name, password, email, tel, role, sms_yn) '
                   +'VALUES ("'+_createdDate+'", "'+_userId+'", "'+_name+'", "'+_password+'", "'+_email+'", "'+_tel+'", '+_role+', "'+_smsYN+'");';

      return query;
   },
    infomationUpdate: function(data){
        // 계정 정보 수정
        var _data = data;
        var _id = _data.id;
        var _modifiedDate = _data.modifiedDate;
        var _userId = _data.userId;
        var _name = _data.name;
        var _email = _data.email;
        var _tel = _data.tel;
        var _role = _data.role || 0;
        var _smsYN = _data.smsYN || 'N';
      
      var query = 'UPDATE hds_account SET '
                +'modified_date="'+_modifiedDate+'", '
                +'name="'+_name+'", '
                +'email="'+_email+'", '
                +'tel="'+_tel+'", '
                +'role='+_role+', '
                +'sms_yn="'+_smsYN+'" '
                +'WHERE id='+_id+';';
 
      return query;
 
    },
    changePasswordUpdate: function(data){
        // 계정 비밀번호 변경
        var _data = data;
        var _id = _data.id;
        var _modifiedDate = _data.modifiedDate;
        var _password = _data.password;
      
      var query = 'UPDATE hds_account SET '
                +'modified_date="'+_modifiedDate+'", '
                +'password="'+_password+'" '
                +'WHERE id='+_id+';';
 
      return query;
 
    },
    receiver_select: function(){
       // 알림 수신자 조회 
       return 'SELECT * FROM hds_account WHERE role=3';
    },
    receiver_signUp: function(data){
      // 알림 수신자 등록
      var _data = data;
      var _createdDate = _data.createdDate;
      var _name = _data.name;
      var _tel = _data.tel;
      var _role = 3;
      var _smsYN = 'Y';
      var _siteId = _data.siteId;

      var query = 'INSERT INTO hds_account ( created_date, name, tel, role, sms_yn, site_id) '
                   +'VALUES ("'+_createdDate+'", "'+_name+'", "'+_tel+'", '+_role+', "'+_smsYN+'", '+_siteId+');';

      return query;
    },
    receiver_update: function(data){
      // 알림 수신자 수정
      var _data = data;
      var _id = _data.id;
      var _modifiedDate = _data.modifiedDate;
      var _name = _data.name;
      var _tel = _data.tel;
      var _role = 3;
      var _smsYN = 'Y';
    
    var query = 'UPDATE hds_account SET '
              +'modified_date="'+_modifiedDate+'", '
              +'name="'+_name+'", '
              +'tel="'+_tel+'", '
              +'role='+_role+', '
              +'sms_yn="'+_smsYN+'" '
              +'WHERE id='+_id+';';

    return query;

  },    
   delete: function(id){
      var _id = id;
      
      var query = 'DELETE FROM hds_account where id='+id;
      return query;
   }
 }
 
 module.exports=_query;
 