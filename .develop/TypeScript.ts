// Extract type from object
type Obj = {
  role: string;
  name: string;
  age: number;
};

type ValuesOf<T> = T[keyof T];

type ExtractStringKeys<TObj, TCondition> = ValuesOf<{
  [K in keyof TObj]: TObj[K] extends TCondition ? K : never;
}>;

type Example1 = ExtractStringKeys<Obj, string>; // "role" | "name"
type Example2 = ExtractStringKeys<Obj, number>; // "age"

// Extract array members
const roles = ['user', 'admin', 'superuser'] as const;

type RolesArray = typeof roles;

type Roles = RolesArray[number]; //"user" | "admin" | "superuser"


