public class contactsearch {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getcontacts() {

        return [select Id,FirstName,LastName,Phone,Email from Contact];

    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> searchcontacts(String search){
        String SearchKey = '%'+search+'%';
        return [select Id,FirstName,LastName,Phone,Email from Contact where LastName Like:SearchKey or  FirstName Like:SearchKey];
        
    }
}