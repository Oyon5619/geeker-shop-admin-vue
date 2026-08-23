import {
  addUserApi,
  getUserListApi,
  modifyUserApi,
  removeUserApi,
} from "@/api/userApi";
import { DEFAULT_PAGE, PAGE_SIZE_10 } from "@/constants/pagination";
import { COMMON_STATUS } from "@/constants/statusEnum";
import type {
  AddUserApiReq,
  GetUserListApiReq,
  ModifyUserApiReq,
} from "@/types/apiTypes/userApiTypes";
import { isEmpty } from "lodash";
import type { UploadFileInfo } from "naive-ui/es/upload";
import { computed, reactive, ref } from "vue";
import { useRequest } from "vue-hooks-plus";

type QueryValues = Pick<GetUserListApiReq, "keyword" | "user_level_id">;

interface UserFormModel extends ModifyUserApiReq {
  avatarList?: UploadFileInfo[];
}

const getUserListAsync = async (req?: GetUserListApiReq) => {
  const { page = DEFAULT_PAGE, limit = PAGE_SIZE_10 } = req ?? {};

  try {
    const { data } = await getUserListApi({ ...req, page, limit });

    const total = data?.totalCount ?? 0;
    const pageCount = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      pageCount,
      userList: data?.list ?? [],
      userLevels: data?.user_level ?? [],
    };
  } catch (err) {
    console.error(err);

    return {
      userList: [],
      userLevels: [],
      page,
      limit,
      total: 0,
      pageCount: 0,
    };
  }
};

const removeUserAsync = async (id: number) => {
  const { data } = await removeUserApi(id);
  return data;
};

const modifyUserAsync = async (req: ModifyUserApiReq) => {
  const { data } = await modifyUserApi(req);
  return data;
};

const addUserAsync = async (req: AddUserApiReq) => {
  const { data } = await addUserApi(req);
  return !isEmpty(data?.id);
};

export const useUserListManager = () => {
  const currentPage = ref(DEFAULT_PAGE);
  const isEdit = ref(false);
  const queryValues = reactive<QueryValues>({});
  const userFormModel = reactive<UserFormModel>({});

  const drawerTitle = computed(() => (isEdit.value ? "编辑用户" : "新增用户"));
  const submitSuccessTips = computed(() =>
    isEdit.value ? "编辑用户成功!" : "新增用户成功!",
  );

  const setFormValues = (userInfo: UserFormModel) => {
    const {
      id,
      username,
      nickname,
      password,
      phone,
      email,
      status,
      user_level_id,
      avatar,
    } = userInfo;

    userFormModel.id = id;
    userFormModel.username = username;
    userFormModel.nickname = nickname;
    userFormModel.password = password;
    userFormModel.phone = phone;
    userFormModel.email = email;
    userFormModel.status = status;
    userFormModel.user_level_id = user_level_id;
    userFormModel.avatarList = avatar
      ? [{ id: avatar, name: avatar, url: avatar, status: "finished" }]
      : [];
  };

  const resetFormValues = () => {
    setFormValues({
      id: undefined,
      username: undefined,
      nickname: undefined,
      password: undefined,
      user_level_id: undefined,
      phone: undefined,
      email: undefined,
      status: COMMON_STATUS.VALID,
      avatar: undefined,
    });
  };

  const {
    run: getUserList,
    data: userListData,
    loading,
  } = useRequest(getUserListAsync, { manual: true });

  const { runAsync: removeUser } = useRequest(removeUserAsync, {
    manual: true,
  });

  const { runAsync: submitUserInfo, loading: isSubmitting } = useRequest(
    async () => {
      const { avatarList, ...rest } = userFormModel;
      const avatar = avatarList?.[0]?.url ?? "";
      const req = { ...rest, avatar };

      if (isEdit.value) {
        return await modifyUserAsync(req);
      }

      return await addUserAsync(req);
    },
    { manual: true },
  );

  return {
    userListData,
    loading,
    queryValues,
    currentPage,
    isEdit,
    userFormModel,
    drawerTitle,
    submitSuccessTips,
    isSubmitting,
    getUserList,
    removeUser,
    submitUserInfo,
    setFormValues,
    resetFormValues,
  };
};
