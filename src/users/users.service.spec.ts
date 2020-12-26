import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

// 알고리즘

// 1. 가짜 모듈을 만든다.
// - DI 처리를 모킹 함수를 이용한다.
// - TypeORM의 모킹 처리 getRepositoryToken , mockRepository ( jest.fn 이용 )
// - 타 모듈 서비스의 모킹 처리 JwtService , mockJwtService  ( jest.fn 이용 )

// 2. 가짜 모듈에서 서비스를 가져온다.

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

// 가짜 T 제너릭, typeorm 레포 만들기 (알고리즘)
// Partial 타입으로 모든 타입을 optional 하게 만든다.
// Record 타입으로 object 타입의 key,value를 명시
// keyof 를 통해서 Repository 객체의 모든 key 값을 가져온다. (Repository 의 제너릭은 T로 뺀다. T는 any로 둔다. )
// 모든 key 값에 대응해서 jest.Mock 이라는 타입으로 value를 지정한다.

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  // it 테스트때 공통으로 사용할 변수들이다.
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  // 테스트 하기전에 모든 it 에 대해서 , 사전 준비를 아래와 같이 한다.
  // 테스트 모듈을 만들고, 해당 모듈에서 테스트 service를 가져온다, 그리고 가짜 repo를 가져온다.
  beforeAll(async () => {
    // 테스팅 모듈을 직접 만든다. nestjs 에서 제공하는 jest와 호환가능한 테스팅 모듈 제공
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    //  모듈 가져오기
    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  // 서비스가 정의 되었는지 테스트
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // createAccount 테스트
  describe('createAccount', () => {
    //이미 있는 emaill에 대해서 createAccount 하려는 경우
    it('should fail if user exists', async () => {
      // repo에서 findOne 할때 출력값 셋팅
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@email.com',
      });
      // service 실행
      const result = await service.createAccount({
        email: 'test@email.com',
        password: '',
        role: 0,
      });
      // 결과 확인
      expect(result).toMatchObject({
        ok: false,
        error: 'email is already taken',
      });
    });
  });

  // 테스트할 목록들을 todo로 나열
  // it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
