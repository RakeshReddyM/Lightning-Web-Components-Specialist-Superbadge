public with sharing class fetchContacts {
   @AuraEnabled(cacheable = true)
   public static List<Contact> Contacts(String Account){
       String accId = Account;
       return [select firstName,LastName,Name,Email,Phone,Account.Name from Contact where AccountId=:accId];
       
   } 
}