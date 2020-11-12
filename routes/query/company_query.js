const _query = {
    counts: function() {
       var query = 'SELECT count(*) FROM company';
       return query
    },
    selectAll: function(){
       return 'SELECT * FROM company ORDER BY comp_name ASC;';
    },
    selectOne: function(id){
       var _id = id;
       var query = 'SELECT * FROM company where id='+_id;
       return query;
    },
    insert: function(data){
       var _data = data;

       var _createDate = _data.createdDate || null;
       var _companyName = _data.companyName || null;
 
       var query = 'INSERT INTO company (created_date, comp_name) VALUES ("'+_createDate+'", "'+_companyName+'"); ';
 
       return query;
    },
    update: function(data){
        var _data = data;
        var _id = _data.id;
        var _modifiedDate = _data.modifiedDate || null;
        var _companyName = _data.companyName || null;
        console.log("data->>>",data);
        var query ='UPDATE company '
                   +'SET modified_date = "'+_modifiedDate+'", '
                   +'comp_name = "'+_companyName+'" WHERE id = '+_id+';';
        return query;
 
    },
    delete: function(id){
        var _id = id;
      
        var query = 'DELETE FROM company where id='+id;
        return query;
    },
    checked: function(data) {
        var _data = data;
        var _companyName = data.companyName;
        var query = 'SELECT id, COUNT(*) AS count FROM company WHERE comp_name = "'+_companyName+'";';

        return query;
    }
 }
 
 module.exports=_query;
 