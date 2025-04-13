using System.Text.Json;
using TestTask.Models;

namespace TestTask.App_Data
{
    public static class DataAccess
    {
        private static readonly string DbPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "App_Data",
            "Database.json"
        );
        
        private static readonly object _fileLock = new object();

        public static List<User> LoadUsers()
        {
            lock (_fileLock)
            {
                if (!File.Exists(DbPath))
                {
                    return new List<User>();
                }

                var json = File.ReadAllText(DbPath);
                return JsonSerializer.Deserialize<List<User>>(json) 
                       ?? new List<User>();
            }
        }

        public static void AddUser(User newUser)
        {
            lock (_fileLock)
            {
                var users = LoadUsers();
                
                newUser.Id = users.Count == 0 
                    ? 1 
                    : users.Max(u => u.Id) + 1;

                users.Add(newUser);
                SaveUsers(users);
            }
        }

        public static bool UpdateUser(User updatedUser)
        {
            lock (_fileLock)
            {
                var users = LoadUsers();
                var user = users.FirstOrDefault(u => u.Id == updatedUser.Id);
                
                if (user == null) return false;
                
                user.Name = updatedUser.Name;
                user.Surname = updatedUser.Surname;
                user.Email = updatedUser.Email;
                user.Age = updatedUser.Age;
                
                SaveUsers(users);
                return true;
            }
        }

        public static bool DeleteUser(int id)
        {
            lock (_fileLock)
            {
                var users = LoadUsers();
                var userToRemove = users.FirstOrDefault(u => u.Id == id);
                
                if (userToRemove == null) return false;
                
                users.Remove(userToRemove);
                SaveUsers(users);
                return true;
            }
        }

        private static void SaveUsers(List<User> users)
        {
            var options = new JsonSerializerOptions 
            { 
                WriteIndented = true 
            };
            
            var json = JsonSerializer.Serialize(users, options);
            File.WriteAllText(DbPath, json);
        }
    }
}
