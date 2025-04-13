using System.ComponentModel.DataAnnotations;

namespace TestTask.Models
{
    public class User
    {
        public int Id { get; set; }       
        
        [Required(ErrorMessage = "Имя обязательно")]
        public string Name { get; set; }  
        
        [Required(ErrorMessage = "Фамилия обязательна")]
        public string Surname { get; set; }
        
        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage = "Некорректный формат email")]
        public string Email { get; set; } 
        
        [Range(1, 150, ErrorMessage = "Возраст должен быть от 1 до 150")]
        public int Age { get; set; }      

    }
}