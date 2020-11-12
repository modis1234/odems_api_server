const _query = {
    counts: function() {
       var query = 'SELECT count(*) FROM site';
       return query
    },
    selectAll: function(){
       return 'SELECT * FROM site_view ORDER BY site_name ASC;';
    },
    selectOne: function(id){
       var _id = id;
       var query = 'SELECT * FROM site_view where id='+_id;
       return query;
    },
    insert: function(data){
       var _data = data;

       var _createDate = _data.createdDate || null;
       var _siteName = _data.siteName || null;
       var _siteUrl = '"'+_data.siteUrl+'"' || null;
       var _companyId = _data.companyId || 0;
       var query = 'INSERT INTO site (created_date, site_name, site_url, comp_id) VALUES ("'+_createDate+'", "'+_siteName+'", '+_siteUrl+','+_companyId+'); ';
 
       return query;
    },
    update: function(data){
        var _data = data;
        var _id = _data.id;
        var _modifiedDate = _data.modifiedDate;
        var _siteName = _data.siteName;
        var _siteUrl = '"'+_data.siteUrl+'"' || null;
        var _companyId = _data.companyId;
        var query ='UPDATE site '
                   +'SET modified_date = "'+_modifiedDate+'", '
                   +'site_name="'+_siteName+'", '
                   +'site_url ='+_siteUrl+', '
                   +'comp_id='+_companyId+' '
                   +'WHERE id = '+_id+';';
        return query;
 
    },
    delete: function(id){
        var _id = id;
      
        var query = 'DELETE FROM site where id='+id;
        return query;
    },
    checked: function(data) {
      var _data = data;
      var _siteName = data.siteName;
      var query = 'SELECT id, COUNT(*) AS count FROM site WHERE site_name = "'+_siteName+'";';

      return query;
   }
 }
 
 module.exports=_query;
 