using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Enums
{
    public class DishEnums
    {
        public enum DishCategory
        {
            Dessert, FirstCourse, SecondCourse, Drink, Salad, Soup, Snack
        }

        [Flags]
        public enum DishFlags
        {
            None = 0,
            Vegan = 1,
            GlutenFree = 2,
            SugarFree = 3
        }
    }
}