"use server";

import authOptions from "@/src/authOptions";
import {
  createUser,
  generateNewActivationToken,
  generateResetPasswordToken,
  getUserByEmail,
  updatePassword,
  updatePasswordByToken,
  updatePersonalInfo,
} from "@/src/services/accountService";
import mailService from "@/src/services/mailService";
import { pushMessage } from "@/src/services/messageService";
import {
  ChangePasswordFields,
  MessageType,
  PersonalInfoFields,
  ResetPasswordFields,
  ResetPasswordTokenFields,
  SigninFields,
  VerifyAccountFields,
} from "@/src/types";
import {
  changePasswordValidator,
  personalInfoValidator,
  signinValidator,
} from "@/src/validators";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function changePasswordAction(dataObj: ChangePasswordFields) {
  "use server";
  const data = await getServerSession(authOptions);

  var validationResult = await changePasswordValidator.isValid(dataObj);

  if (validationResult && data?.user) {
    var result = await updatePassword(
      dataObj.currentPassword,
      dataObj.password,
      data?.user?.email!
    );

    if (result) {
      pushMessage({
        text: "Password cambiata con successo",
        type: MessageType.SUCCESS,
      });

      return {
        result: "success",
      };
    } else {
      pushMessage({
        text:
          "Impossibile eseguire l'operazione, la password attuale potrebbe essere errata",
        type: MessageType.ERROR,
      });

      return {
        result: "failed",
      };
    }
  } else {
    return {
      result: "failed",
    };
  }
}

export async function personalInfoAction(object: PersonalInfoFields) {
  "use server";
  var validationResult = await personalInfoValidator.isValid(object);

  const data = await getServerSession(authOptions);

  if (validationResult) {
    await updatePersonalInfo(data?.user!.email!, {
      firstname: object.firstname,
      lastname: object.lastname,
    });

    pushMessage({
      text: "Informazioni aggiornate con successo",
      type: MessageType.SUCCESS,
    });
  } else {
    pushMessage({
      text:
        "Si è verificato un errore durante l'aggiornamento delle informazioni",
      type: MessageType.ERROR,
    });

    return {
      result: "error",
    };
  }

  redirect("/account/informazioni-personali");
}

export async function resetPasswordAction(object: ResetPasswordFields) {
  var { email } = object;

  if (email) {
    var user = await getUserByEmail(email);

    if (user) {
      var token = await generateResetPasswordToken(email);
      mailService.initService();
      await mailService.sendResetPassword(
        user.email,
        `${process.env.SERVER_URL}/auth/reset-password/token?token=${token}`
      );
    }

    pushMessage({
      text: "Controlla la tua email per resettare la tua password",
      type: MessageType.SUCCESS,
    });
  } else {
    pushMessage({
      text: "Richiesta non valida",
      type: MessageType.ERROR,
    });
  }
  redirect(`/auth/login`);
}

export async function resetPasswordTokenAction(
  object: ResetPasswordTokenFields
) {
  var { password, token } = object;

  var result = await updatePasswordByToken(password, token);

  if (result) {
    pushMessage({
      text: "Password cambiata con successo",
      type: MessageType.SUCCESS,
    });
  } else {
    pushMessage({
      text: "Richiesta fallita",
      type: MessageType.ERROR,
    });
  }

  redirect(`/auth/login`);
}

export async function verifyAccountAction(object: VerifyAccountFields) {
  "use server";
  var { email } = object;

  if (email) {
    var user = await getUserByEmail(email);

    if (user) {
      var token = await generateNewActivationToken(email);
      var activationUrl = `${process.env.SERVER_URL}/auth/verifica-account/token?token=${token}&email=${email}`;
      mailService.initService();
      await mailService.sendActivateAccountCode(user.email, activationUrl);
    }

    pushMessage({
      text: "Controlla la tua email per attivare il tuo account",
      type: MessageType.SUCCESS,
    });
  } else {
    pushMessage({
      text: "Richiesta non valida",
      type: MessageType.ERROR,
    });
  }
  redirect(`/auth/login`);
}

export async function signinAction(object: SigninFields) {
  var validationResult = await signinValidator.isValid(object);

  if (validationResult) {
    var { email, firstname, lastname, password } = object;
    var user = await createUser({
      email: email as string,
      firstname: firstname as string,
      lastname: lastname as string,
      passwordHash: password as string,
    });

    if (user) {
      var activationUrl = `${process.env.SERVER_URL}/auth/verifica-account/token?token=${user.activationToken}&email=${email}`;
      mailService.initService();
      await mailService.sendActivateAccountCode(user.email, activationUrl);

      pushMessage({
        text: "Account creato con successo verifica la tua casella di posta",
        type: MessageType.SUCCESS,
      });
    }
  } else {
    pushMessage({
      text:
        "Si è verificato un errore durante la creazione dell'account, contatta l'amministratore",
      type: MessageType.ERROR,
    });
  }

  redirect(`/auth/login`);
}
