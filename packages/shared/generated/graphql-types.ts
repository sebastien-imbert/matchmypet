import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../server/src/index';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  breed?: Maybe<Scalars['String']['output']>;
  breedingStatus: BreedingStatus;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
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
  breed?: InputMaybe<Scalars['String']['input']>;
  breedingStatus: BreedingStatus;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sex: Sex;
  species: Species;
};

export type DeleteAnimalInput = {
  id: Scalars['ID']['input'];
};

export type EditAnimalInput = {
  age: Scalars['Int']['input'];
  breed?: InputMaybe<Scalars['String']['input']>;
  breedingStatus: BreedingStatus;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  sex: Sex;
  species: Species;
};

export type HomeData = {
  __typename?: 'HomeData';
  availableAnimals: Array<Animal>;
  lookingAnimals: Array<Animal>;
  me?: Maybe<User>;
  myAnimals: Array<Animal>;
};

export type Location = {
  __typename?: 'Location';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type LocationInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAnimal: Animal;
  deleteAnimal: Animal;
  editAnimal: Animal;
  login: AuthPayload;
  signup: AuthPayload;
};


export type MutationCreateAnimalArgs = {
  input: CreateAnimalInput;
};


export type MutationDeleteAnimalArgs = {
  input: DeleteAnimalInput;
};


export type MutationEditAnimalArgs = {
  input: EditAnimalInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};

export type Query = {
  __typename?: 'Query';
  availableAnimals: Array<Animal>;
  getAnimal?: Maybe<Animal>;
  homeData: HomeData;
  lookingAnimals: Array<Animal>;
  me?: Maybe<User>;
  myAnimals: Array<Animal>;
};


export type QueryGetAnimalArgs = {
  id: Scalars['ID']['input'];
};

export type Sex =
  | 'FEMALE'
  | 'MALE';

export type SignupInput = {
  email: Scalars['String']['input'];
  location?: InputMaybe<LocationInput>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Species =
  | 'CHAT'
  | 'CHIEN';

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location?: Maybe<Location>;
  username: Scalars['String']['output'];
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
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  HomeData: ResolverTypeWrapper<HomeData>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Location: ResolverTypeWrapper<Location>;
  LocationInput: LocationInput;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Sex: Sex;
  SignupInput: SignupInput;
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
  Float: Scalars['Float']['output'];
  HomeData: HomeData;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Location: Location;
  LocationInput: LocationInput;
  LoginInput: LoginInput;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  SignupInput: SignupInput;
  String: Scalars['String']['output'];
  User: User;
};

export type AnimalResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Animal'] = ResolversParentTypes['Animal']> = {
  age?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  breed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  breedingStatus?: Resolver<ResolversTypes['BreedingStatus'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  sex?: Resolver<ResolversTypes['Sex'], ParentType, ContextType>;
  species?: Resolver<ResolversTypes['Species'], ParentType, ContextType>;
};

export type AuthPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type HomeDataResolvers<ContextType = Context, ParentType extends ResolversParentTypes['HomeData'] = ResolversParentTypes['HomeData']> = {
  availableAnimals?: Resolver<Array<ResolversTypes['Animal']>, ParentType, ContextType>;
  lookingAnimals?: Resolver<Array<ResolversTypes['Animal']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  myAnimals?: Resolver<Array<ResolversTypes['Animal']>, ParentType, ContextType>;
};

export type LocationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAnimal?: Resolver<ResolversTypes['Animal'], ParentType, ContextType, RequireFields<MutationCreateAnimalArgs, 'input'>>;
  deleteAnimal?: Resolver<ResolversTypes['Animal'], ParentType, ContextType, RequireFields<MutationDeleteAnimalArgs, 'input'>>;
  editAnimal?: Resolver<ResolversTypes['Animal'], ParentType, ContextType, RequireFields<MutationEditAnimalArgs, 'input'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  signup?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'input'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  availableAnimals?: Resolver<Array<ResolversTypes['Animal']>, ParentType, ContextType>;
  getAnimal?: Resolver<Maybe<ResolversTypes['Animal']>, ParentType, ContextType, RequireFields<QueryGetAnimalArgs, 'id'>>;
  homeData?: Resolver<ResolversTypes['HomeData'], ParentType, ContextType>;
  lookingAnimals?: Resolver<Array<ResolversTypes['Animal']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  myAnimals?: Resolver<Array<ResolversTypes['Animal']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Animal?: AnimalResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  HomeData?: HomeDataResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

