import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../server/src/index';
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Animal = {
  __typename?: 'Animal';
  age: Scalars['Int']['output'];
  breed: Maybe<Scalars['String']['output']>;
  breedingStatus: BreedingStatus;
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: User;
  sex: Sex;
  species: Species;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type BreedingStatus =
  | 'AVAILABLE'
  | 'LOOKING'
  | 'NONE';

export type CreateAnimalInput = {
  age: Scalars['Int']['input'];
  breed: InputMaybe<Scalars['String']['input']>;
  breedingStatus: BreedingStatus;
  description: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sex: Sex;
  species: Species;
};

export type DeleteAnimalInput = {
  id: Scalars['ID']['input'];
};

export type EditAnimalInput = {
  age: Scalars['Int']['input'];
  breed: InputMaybe<Scalars['String']['input']>;
  breedingStatus: BreedingStatus;
  description: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  sex: Sex;
  species: Species;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAnimal: Animal;
  deleteAnimal: Scalars['Boolean']['output'];
  editAnimal: Animal;
  login: AuthPayload;
  signup: AuthPayload;
};


export type MutationCreateAnimalArgs = {
  input: CreateAnimalInput;
};


export type MutationDeleteAnimalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEditAnimalArgs = {
  input: EditAnimalInput;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  availableAnimals: Array<Animal>;
  getAnimal: Maybe<Animal>;
  hello: Scalars['String']['output'];
  lookingAnimals: Array<Animal>;
  me: Maybe<User>;
  myAnimals: Array<Animal>;
};


export type QueryGetAnimalArgs = {
  id: Scalars['ID']['input'];
};

export type Sex =
  | 'FEMALE'
  | 'MALE';

export type Species =
  | 'CHAT'
  | 'CHIEN';

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Animal: ResolverTypeWrapper<Animal>;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BreedingStatus: BreedingStatus;
  CreateAnimalInput: CreateAnimalInput;
  DeleteAnimalInput: DeleteAnimalInput;
  EditAnimalInput: EditAnimalInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Sex: Sex;
  Species: Species;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Animal: Animal;
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  CreateAnimalInput: CreateAnimalInput;
  DeleteAnimalInput: DeleteAnimalInput;
  EditAnimalInput: EditAnimalInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  User: User;
};

export type AnimalResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Animal'] = ResolversParentTypes['Animal']> = {
  age: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  breed: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  breedingStatus: Resolver<ResolversTypes['BreedingStatus'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  sex: Resolver<ResolversTypes['Sex'], ParentType, ContextType>;
  species: Resolver<ResolversTypes['Species'], ParentType, ContextType>;
};

export type AuthPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAnimal: Resolver<ResolversTypes['Animal'], ParentType, ContextType, RequireFields<MutationCreateAnimalArgs, 'input'>>;
  deleteAnimal: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAnimalArgs, 'id'>>;
  editAnimal: Resolver<ResolversTypes['Animal'], ParentType, ContextType, RequireFields<MutationEditAnimalArgs, 'input'>>;
  login: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  signup: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'password'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  availableAnimals: Resolver<Array<ResolversTypes['Animal']>, ParentType, ContextType>;
  getAnimal: Resolver<Maybe<ResolversTypes['Animal']>, ParentType, ContextType, RequireFields<QueryGetAnimalArgs, 'id'>>;
  hello: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lookingAnimals: Resolver<Array<ResolversTypes['Animal']>, ParentType, ContextType>;
  me: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  myAnimals: Resolver<Array<ResolversTypes['Animal']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Animal: AnimalResolvers<ContextType>;
  AuthPayload: AuthPayloadResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  User: UserResolvers<ContextType>;
};

