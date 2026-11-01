// @vitest-environment jsdom
import { act, render, renderHook, waitFor } from "@testing-library/react";
import { useMemo } from "react";
import { describe, expect, it, vi } from "vitest";
import { useLibraryReady, useSocialShareButton } from "@/lib/social-share-button";
import { FakeShareButton, loadShareLibrary } from "./helpers";

describe("useLibraryReady", () => {
  it("becomes ready on the next frame when the library is already loaded", async () => {
    loadShareLibrary();
    const { result } = renderHook(() => useLibraryReady());
    expect(result.current).toBe(false);
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("polls until the library script has loaded", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useLibraryReady());
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(false);
    loadShareLibrary();
    act(() => vi.advanceTimersByTime(50));
    expect(result.current).toBe(true);
  });

  it("stops polling on unmount", () => {
    vi.useFakeTimers();
    const clear = vi.spyOn(window, "clearInterval");
    const { unmount } = renderHook(() => useLibraryReady());
    unmount();
    expect(clear).toHaveBeenCalled();
  });

  it("cancels the pending frame on unmount", () => {
    loadShareLibrary();
    const cancel = vi.spyOn(window, "cancelAnimationFrame");
    const { unmount } = renderHook(() => useLibraryReady());
    unmount();
    expect(cancel).toHaveBeenCalled();
  });
});

function Mount({ options }: { options: { title: string } | null }) {
  const stable = useMemo(() => options, [options]);
  const { containerRef } = useSocialShareButton(stable);
  return <div ref={containerRef} data-testid="container" />;
}

describe("useSocialShareButton", () => {
  it("mounts an instance into the container with the given options", async () => {
    loadShareLibrary();
    const { getByTestId } = render(<Mount options={{ title: "Hello" }} />);
    await waitFor(() => expect(FakeShareButton.instances).toHaveLength(1));
    expect(FakeShareButton.instances[0].options).toEqual({ title: "Hello", container: getByTestId("container") });
  });

  it("destroys and recreates the instance when the options change, and destroys it on unmount", async () => {
    loadShareLibrary();
    const first = { title: "One" };
    const { rerender, unmount } = render(<Mount options={first} />);
    await waitFor(() => expect(FakeShareButton.instances).toHaveLength(1));
    rerender(<Mount options={{ title: "Two" }} />);
    expect(FakeShareButton.instances).toHaveLength(2);
    expect(FakeShareButton.instances[0].destroy).toHaveBeenCalledTimes(1);
    expect(FakeShareButton.live().map((i) => i.options.title)).toEqual(["Two"]);
    unmount();
    expect(FakeShareButton.live()).toHaveLength(0);
  });

  it("creates nothing while the library has not loaded", () => {
    vi.useFakeTimers();
    render(<Mount options={{ title: "x" }} />);
    act(() => vi.advanceTimersByTime(200));
    expect(FakeShareButton.instances).toHaveLength(0);
  });

  it("creates nothing for null options once the library has loaded", () => {
    vi.useFakeTimers();
    render(<Mount options={null} />);
    loadShareLibrary();
    act(() => vi.advanceTimersByTime(50));
    expect(FakeShareButton.instances).toHaveLength(0);
  });

  it("exposes the live instance and clears it once destroyed", async () => {
    loadShareLibrary();
    const { result, unmount } = renderHook(() => {
      const options = useMemo(() => ({ title: "t" }), []);
      const binding = useSocialShareButton(options);
      // Attach the container ref to a detached element so the effect can mount
      if (!binding.containerRef.current) (binding.containerRef as { current: HTMLDivElement | null }).current = document.createElement("div");
      return binding;
    });
    await waitFor(() => expect(result.current.ready).toBe(true));
    await waitFor(() => expect(result.current.instanceRef.current).toBe(FakeShareButton.instances[0]));
    const ref = result.current.instanceRef;
    unmount();
    expect(ref.current).toBeNull();
  });
});
