import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "@/assets/icons/JobbyEmployer.png";
import { ChevronDownIcon, UploadIcon } from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  searchAddressByProvince,
  type ThaiAddressEntry,
} from "thai-address-database";
import { useNavigate } from "react-router-dom";
import type {
  CompanyFormState,
  FormStep,
  SearchSelectProps,
  SignInFormState,
  SignUpFormErrors,
  SignUpFormState,
  VerifyFormState,
} from "@/types/authSignUpTypes";

const initialFormState: SignUpFormState = {
  email: "",
  password: "",
  acceptedTerms: false,
};

const initialCompanyFormState: CompanyFormState = {
  companyNameTh: "",
  companyNameEn: "",
  website: "",
  phone: "",
  category: "",
  addressLine: "",
  addressNo: "",
  moo: "",
  soi: "",
  street: "",
  province: "",
  district: "",
  subDistrict: "",
  postalCode: "",
};

const initialVerifyFormState: VerifyFormState = {
  verificationFile: null,
};

const initialSignInFormState: SignInFormState = {
  email: "",
  password: "",
};

const STEP_TRANSITION_MS = 220;
const MAX_ADDRESS_RESULTS = 100000;
const MAX_RECOMMENDATIONS = 50;

const categoryOptions = ["Technology", "Finance", "Marketing", "Retail"];

function toDigitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function toUniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "th"));
}

function getRecommendations(options: string[], keyword: string): string[] {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase("th");

  if (!normalizedKeyword) {
    return options.slice(0, MAX_RECOMMENDATIONS);
  }

  return options
    .filter((option) =>
      option.toLocaleLowerCase("th").includes(normalizedKeyword),
    )
    .slice(0, MAX_RECOMMENDATIONS);
}

function validateSignUpForm(values: SignUpFormState): SignUpFormErrors {
  const errors: SignUpFormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email.trim()) {
    errors.email = "Please enter your email";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Please enter your password";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = "Please accept terms and condition";
  }

  return errors;
}

function isCompanyFormComplete(values: CompanyFormState): boolean {
  return (
    values.companyNameTh.trim().length > 0 &&
    values.companyNameEn.trim().length > 0 &&
    values.website.trim().length > 0 &&
    values.phone.trim().length > 0 &&
    values.category.trim().length > 0 &&
    values.addressLine.trim().length > 0 &&
    values.addressNo.trim().length > 0 &&
    values.moo.trim().length > 0 &&
    values.soi.trim().length > 0 &&
    values.street.trim().length > 0 &&
    values.province.trim().length > 0 &&
    values.district.trim().length > 0 &&
    values.subDistrict.trim().length > 0 &&
    values.postalCode.trim().length > 0
  );
}

function SearchSelect({
  id,
  value,
  placeholder,
  options,
  disabled = false,
  onValueChange,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const visibleOptions = options.slice(0, MAX_RECOMMENDATIONS);

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div className="relative">
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            onValueChange(event.target.value);
            setIsOpen(true);
          }}
          className="h-10 rounded-lg bg-white pr-9"
        />
        <ChevronDownIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
      </div>

      {isOpen && !disabled ? (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          {visibleOptions.length > 0 ? (
            <div className="max-h-36 overflow-y-auto py-1">
              {visibleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="hover:bg-accent hover:text-accent-foreground block w-full px-3 py-2 text-left text-sm text-foreground"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onValueChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No matching options
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function SignUpPage() {
  const [formState, setFormState] = useState<SignUpFormState>(initialFormState);
  const [signInFormState, setSignInFormState] = useState<SignInFormState>(
    initialSignInFormState,
  );
  const [companyFormState, setCompanyFormState] = useState<CompanyFormState>(
    initialCompanyFormState,
  );
  const [verifyFormState, setVerifyFormState] = useState<VerifyFormState>(
    initialVerifyFormState,
  );
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<FormStep>("account");
  const [isStepVisible, setIsStepVisible] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const thaiAddressDataset = useMemo<ThaiAddressEntry[]>(() => {
    return searchAddressByProvince(".+", MAX_ADDRESS_RESULTS);
  }, []);

  const allProvinceOptions = useMemo(() => {
    return toUniqueSorted(thaiAddressDataset.map((item) => item.province));
  }, [thaiAddressDataset]);

  const isSelectedProvinceValid = useMemo(() => {
    return allProvinceOptions.includes(companyFormState.province);
  }, [allProvinceOptions, companyFormState.province]);

  const allDistrictOptions = useMemo(() => {
    if (!isSelectedProvinceValid) {
      return [];
    }

    return toUniqueSorted(
      thaiAddressDataset
        .filter((item) => item.province === companyFormState.province)
        .map((item) => item.amphoe),
    );
  }, [companyFormState.province, isSelectedProvinceValid, thaiAddressDataset]);

  const isSelectedDistrictValid = useMemo(() => {
    return allDistrictOptions.includes(companyFormState.district);
  }, [allDistrictOptions, companyFormState.district]);

  const allSubDistrictOptions = useMemo(() => {
    if (!isSelectedProvinceValid || !isSelectedDistrictValid) {
      return [];
    }

    return toUniqueSorted(
      thaiAddressDataset
        .filter(
          (item) =>
            item.province === companyFormState.province &&
            item.amphoe === companyFormState.district,
        )
        .map((item) => item.district),
    );
  }, [
    companyFormState.district,
    companyFormState.province,
    isSelectedDistrictValid,
    isSelectedProvinceValid,
    thaiAddressDataset,
  ]);

  const provinceRecommendations = useMemo(() => {
    return getRecommendations(allProvinceOptions, companyFormState.province);
  }, [allProvinceOptions, companyFormState.province]);

  const districtRecommendations = useMemo(() => {
    return getRecommendations(allDistrictOptions, companyFormState.district);
  }, [allDistrictOptions, companyFormState.district]);

  const subDistrictRecommendations = useMemo(() => {
    return getRecommendations(
      allSubDistrictOptions,
      companyFormState.subDistrict,
    );
  }, [allSubDistrictOptions, companyFormState.subDistrict]);

  const isFormValid = useMemo(() => {
    return Object.keys(validateSignUpForm(formState)).length === 0;
  }, [formState]);

  const isCompanyStepValid = useMemo(() => {
    return (
      isCompanyFormComplete(companyFormState) &&
      isSelectedProvinceValid &&
      isSelectedDistrictValid &&
      allSubDistrictOptions.includes(companyFormState.subDistrict)
    );
  }, [
    allSubDistrictOptions,
    companyFormState,
    isSelectedDistrictValid,
    isSelectedProvinceValid,
  ]);

  const runStepTransition = (nextStep: FormStep) => {
    setIsSubmitting(true);
    setIsStepVisible(false);

    window.setTimeout(() => {
      setActiveStep(nextStep);
      setIsStepVisible(true);
      setIsSubmitting(false);
    }, STEP_TRANSITION_MS);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateSignUpForm(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    runStepTransition("company");
  };

  const handleCompanySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCompanyStepValid) {
      return;
    }

    runStepTransition("verify");
  };

  const handleSignInSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/");
  };

  const handleVerifySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/");
  };

  const handleVerificationFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setVerifyFormState({ verificationFile: selectedFile });
  };

  const updateCompanyField = <K extends keyof CompanyFormState>(
    field: K,
    value: CompanyFormState[K],
  ) => {
    setCompanyFormState((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleProvinceChange = (value: string) => {
    setCompanyFormState((previous) => ({
      ...previous,
      province: value,
      district: "",
      subDistrict: "",
      postalCode: "",
    }));
  };

  const handleDistrictChange = (value: string) => {
    setCompanyFormState((previous) => ({
      ...previous,
      district: value,
      subDistrict: "",
      postalCode: "",
    }));
  };

  const handleSubDistrictChange = (value: string) => {
    setCompanyFormState((previous) => {
      const matchedRecord = thaiAddressDataset.find(
        (item) =>
          item.province === previous.province &&
          item.amphoe === previous.district &&
          item.district === value,
      );

      return {
        ...previous,
        subDistrict: value,
        postalCode: matchedRecord
          ? String(matchedRecord.zipcode)
          : previous.postalCode,
      };
    });
  };

  const formTransitionClass = isStepVisible
    ? "translate-y-0 scale-100 opacity-100"
    : "pointer-events-none -translate-y-3 scale-[0.98] opacity-0";

  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-[40vw] overflow-hidden">
          <div className="absolute left-[-41.4vmax] top-1/2 h-[82.8vmax] w-[82.8vmax] -translate-y-1/2 rounded-full">
            <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(248,156,30,0.36)_0%,rgba(248,156,30,0.10)_55%,rgba(248,156,30,0.00)_100%)] blur-2xl" />
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 w-[40vw] overflow-hidden">
          <div className="absolute right-[-41.4vmax] top-1/2 h-[82.8vmax] w-[82.8vmax] -translate-y-1/2 rounded-full">
            <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.41)_0%,rgba(236,72,153,0.12)_55%,rgba(236,72,153,0.00)_100%)] blur-2xl" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-232 flex-col items-center pt-10 sm:pt-16">
        <img
          src={logo}
          alt="Jobby Employer"
          className="mb-8 h-auto w-75 sm:mb-10 sm:w-90"
        />

        <Card
          className={`w-full rounded-2xl border border-border/80 bg-white/85 py-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-[max-width] duration-300 ${
            activeStep === "account"
              ? "max-w-140"
              : activeStep === "signin"
                ? "max-w-140"
                : activeStep === "company"
                  ? "max-w-200"
                  : "max-w-103"
          }`}
        >
          <div
            className={`transition-all duration-220 ease-out ${formTransitionClass}`}
          >
            {activeStep === "account" ? (
              <>
                <CardHeader className="px-7 pt-7 pb-4 sm:px-10">
                  <CardTitle className="text-center text-[34px] font-normal tracking-tight text-foreground sm:text-[28px]">
                    Add Company
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-7 pb-8 sm:px-10">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="signup-email"
                        className="text-sm font-normal text-foreground/90"
                      >
                        Email
                      </label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="email"
                        autoComplete="email"
                        value={formState.email}
                        onChange={(event) => {
                          setFormState((previous) => ({
                            ...previous,
                            email: event.target.value,
                          }));
                        }}
                        aria-invalid={Boolean(errors.email)}
                        className="h-11 rounded-lg bg-white"
                      />
                      {errors.email ? (
                        <p className="text-xs text-destructive">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="signup-password"
                        className="text-sm font-normal text-foreground/90"
                      >
                        Password
                      </label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="password"
                        autoComplete="new-password"
                        value={formState.password}
                        onChange={(event) => {
                          setFormState((previous) => ({
                            ...previous,
                            password: event.target.value,
                          }));
                        }}
                        aria-invalid={Boolean(errors.password)}
                        className="h-11 rounded-lg bg-white"
                      />
                      {errors.password ? (
                        <p className="text-xs text-destructive">
                          {errors.password}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label className="flex items-start gap-2 text-sm text-foreground/90">
                        <Checkbox
                          checked={formState.acceptedTerms}
                          onCheckedChange={(checked) => {
                            setFormState((previous) => ({
                              ...previous,
                              acceptedTerms: checked === true,
                            }));
                          }}
                          className="mt-0.5"
                          aria-invalid={Boolean(errors.acceptedTerms)}
                        />
                        <span>
                          Accept terms and condition
                          <span className="mt-1 block text-xs text-muted-foreground">
                            You agree to our Terms of Service and Privacy
                            Policy.
                          </span>
                        </span>
                      </label>
                      {errors.acceptedTerms ? (
                        <p className="text-xs text-destructive">
                          {errors.acceptedTerms}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-center pt-1">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting || !isFormValid}
                        className="h-11 min-w-35 rounded-full px-8 text-base font-medium"
                      >
                        {isSubmitting ? "Joining..." : "Join"}
                      </Button>
                    </div>

                    <p className="pt-1 text-center text-xs text-muted-foreground">
                      Already have an account?
                      <button
                        type="button"
                        className="ml-1 text-foreground underline-offset-2 hover:underline"
                        onClick={() => runStepTransition("signin")}
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                </CardContent>
              </>
            ) : activeStep === "signin" ? (
              <>
                <CardHeader className="px-7 pt-7 pb-4 sm:px-10">
                  <CardTitle className="text-center text-[34px] font-normal tracking-tight text-foreground sm:text-[28px]">
                    Welcome Employer
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-7 pb-8 sm:px-10">
                  <form className="space-y-4" onSubmit={handleSignInSubmit}>
                    <div className="space-y-1.5">
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="email"
                        autoComplete="email"
                        value={signInFormState.email}
                        onChange={(event) => {
                          setSignInFormState((previous) => ({
                            ...previous,
                            email: event.target.value,
                          }));
                        }}
                        className="h-11 rounded-lg bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="password"
                        autoComplete="current-password"
                        value={signInFormState.password}
                        onChange={(event) => {
                          setSignInFormState((previous) => ({
                            ...previous,
                            password: event.target.value,
                          }));
                        }}
                        className="h-11 rounded-lg bg-white"
                      />
                      <p className="text-right text-xs text-muted-foreground">
                        forget password?
                      </p>
                    </div>

                    <div className="flex items-center justify-center pt-1">
                      <Button
                        type="submit"
                        size="lg"
                        className="h-11 min-w-35 rounded-full px-8 text-base font-medium"
                      >
                        Sign In
                      </Button>
                    </div>

                    <p className="pt-1 text-center text-xs text-foreground">
                      New Company?
                      <button
                        type="button"
                        className="ml-1 font-medium text-[#ff6b40] underline-offset-2 hover:underline"
                        onClick={() => runStepTransition("account")}
                      >
                        Create account
                      </button>
                    </p>
                  </form>
                </CardContent>
              </>
            ) : activeStep === "company" ? (
              <>
                <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-5">
                  <CardTitle className="text-center text-[22px] font-normal tracking-tight text-foreground sm:text-[28px]">
                    Company Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">
                  <form className="space-y-4" onSubmit={handleCompanySubmit}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="company-name-th"
                          className="text-sm font-normal text-foreground/90"
                        >
                          Company name(TH)
                        </label>
                        <Input
                          id="company-name-th"
                          placeholder="Company name"
                          value={companyFormState.companyNameTh}
                          onChange={(event) =>
                            updateCompanyField(
                              "companyNameTh",
                              event.target.value,
                            )
                          }
                          className="h-10 rounded-lg bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="company-name-en"
                          className="text-sm font-normal text-foreground/90"
                        >
                          Company name(ENG)
                        </label>
                        <Input
                          id="company-name-en"
                          placeholder="Company name"
                          value={companyFormState.companyNameEn}
                          onChange={(event) =>
                            updateCompanyField(
                              "companyNameEn",
                              event.target.value,
                            )
                          }
                          className="h-10 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1.1fr_1.1fr_1fr]">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="company-website"
                          className="text-sm font-normal text-foreground/90"
                        >
                          Website
                        </label>
                        <Input
                          id="company-website"
                          placeholder="website"
                          value={companyFormState.website}
                          onChange={(event) =>
                            updateCompanyField("website", event.target.value)
                          }
                          className="h-10 rounded-lg bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="company-phone"
                          className="text-sm font-normal text-foreground/90"
                        >
                          Phone
                        </label>
                        <Input
                          id="company-phone"
                          placeholder="phone"
                          value={companyFormState.phone}
                          onChange={(event) =>
                            updateCompanyField(
                              "phone",
                              toDigitsOnly(event.target.value),
                            )
                          }
                          inputMode="numeric"
                          className="h-10 rounded-lg bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="company-category"
                          className="text-sm font-normal text-foreground/90"
                        >
                          Category
                        </label>
                        <Select
                          value={companyFormState.category}
                          onValueChange={(value) =>
                            updateCompanyField("category", value)
                          }
                        >
                          <SelectTrigger
                            id="company-category"
                            className="h-10 w-full rounded-lg bg-white"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[22px] font-normal text-foreground">
                        Address Information
                      </p>

                      <div className="grid gap-3 sm:grid-cols-[2.3fr_0.65fr_0.7fr_0.7fr]">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="company-address-line"
                            className="text-sm font-normal text-foreground/90"
                          >
                            Address line
                          </label>
                          <Input
                            id="company-address-line"
                            placeholder="bangkok"
                            value={companyFormState.addressLine}
                            onChange={(event) =>
                              updateCompanyField(
                                "addressLine",
                                event.target.value,
                              )
                            }
                            className="h-10 rounded-lg bg-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="company-address-no"
                            className="text-sm font-normal text-foreground/90"
                          >
                            No.
                          </label>
                          <Input
                            id="company-address-no"
                            placeholder="20"
                            value={companyFormState.addressNo}
                            onChange={(event) =>
                              updateCompanyField(
                                "addressNo",
                                toDigitsOnly(event.target.value),
                              )
                            }
                            inputMode="numeric"
                            className="h-10 rounded-lg bg-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="company-moo"
                            className="text-sm font-normal text-foreground/90"
                          >
                            moo
                          </label>
                          <Input
                            id="company-moo"
                            placeholder="Text Here"
                            value={companyFormState.moo}
                            onChange={(event) =>
                              updateCompanyField("moo", event.target.value)
                            }
                            className="h-10 rounded-lg bg-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="company-soi"
                            className="text-sm font-normal text-foreground/90"
                          >
                            soi
                          </label>
                          <Input
                            id="company-soi"
                            placeholder="Text Here"
                            value={companyFormState.soi}
                            onChange={(event) =>
                              updateCompanyField("soi", event.target.value)
                            }
                            className="h-10 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr_0.7fr]">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="company-street"
                            className="text-sm font-normal text-foreground/90"
                          >
                            street
                          </label>
                          <Input
                            id="company-street"
                            placeholder="bangkok"
                            value={companyFormState.street}
                            onChange={(event) =>
                              updateCompanyField("street", event.target.value)
                            }
                            className="h-10 rounded-lg bg-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="company-province"
                            className="text-sm font-normal text-foreground/90"
                          >
                            Province
                          </label>
                          <SearchSelect
                            id="company-province"
                            value={companyFormState.province}
                            placeholder="Type to search province"
                            options={provinceRecommendations}
                            onValueChange={handleProvinceChange}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="company-district"
                            className="text-sm font-normal text-foreground/90"
                          >
                            District
                          </label>
                          <SearchSelect
                            id="company-district"
                            value={companyFormState.district}
                            placeholder={
                              isSelectedProvinceValid
                                ? "Type to search district"
                                : "Select province first"
                            }
                            options={districtRecommendations}
                            disabled={!isSelectedProvinceValid}
                            onValueChange={handleDistrictChange}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="company-sub-district"
                            className="text-sm font-normal text-foreground/90"
                          >
                            Sub-district
                          </label>
                          <SearchSelect
                            id="company-sub-district"
                            value={companyFormState.subDistrict}
                            placeholder={
                              isSelectedDistrictValid
                                ? "Type to search sub-district"
                                : "Select district first"
                            }
                            options={subDistrictRecommendations}
                            disabled={!isSelectedDistrictValid}
                            onValueChange={handleSubDistrictChange}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="company-postal-code"
                            className="text-sm font-normal text-foreground/90"
                          >
                            Postal code
                          </label>
                          <Input
                            id="company-postal-code"
                            placeholder="xxxxx"
                            value={companyFormState.postalCode}
                            onChange={(event) =>
                              updateCompanyField(
                                "postalCode",
                                event.target.value,
                              )
                            }
                            className="h-10 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={!isCompanyStepValid || isSubmitting}
                          className="h-11 min-w-18 rounded-full px-6 text-base font-medium"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="px-5 pt-5 pb-3 sm:px-6 sm:pt-6">
                  <CardTitle className="text-center text-[22px] font-normal tracking-tight text-foreground sm:text-[28px]">
                    Verify Company
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
                  <form className="space-y-4" onSubmit={handleVerifySubmit}>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="verification-file"
                        className="text-xs font-normal text-foreground/90"
                      >
                        P.C. Form 0401
                      </label>

                      <input
                        ref={fileInputRef}
                        id="verification-file"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleVerificationFileChange}
                      />

                      <button
                        type="button"
                        className="flex w-full items-start gap-3 rounded-xl border border-dashed border-border bg-white px-4 py-4 text-left shadow-xs transition-colors hover:border-primary/50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <UploadIcon className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-normal text-foreground">
                            {verifyFormState.verificationFile
                              ? verifyFormState.verificationFile.name
                              : "Upload File"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            pdf Only Max Size 10 MB
                          </p>
                        </div>
                      </button>

                      <p className="text-[11px] leading-4 text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nam blandit ligula eu lectus mollis, non convallis
                        turpis elementum. Sed interdum neque.
                      </p>
                    </div>

                    <div className="flex justify-end pt-1">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={!verifyFormState.verificationFile}
                        className="h-11 min-w-24 rounded-full px-6 text-base font-medium"
                      >
                        Continue
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
